import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: Message[];
  context?: {
    incidents?: number;
    assets?: number;
    threats?: number;
    criticalAlerts?: number;
    databaseContext?: Record<string, unknown>;
  };
}

const SYSTEM_PROMPT = `You are SentinelX AI, an intelligent assistant powered by Google Gemini. You are helpful, friendly, and knowledgeable about a wide range of topics.

When interacting, you can:

1. **General Knowledge**: Answer questions about any topic including science, technology, history, programming, cybersecurity, current events, and more. Use your training data to provide accurate, helpful responses.

2. **Security Operations**: When users ask about security-related topics, you can access their live security database to provide real-time analysis:
   - Incident analysis and recommendations
   - Asset risk assessments
   - Threat intelligence interpretation
   - MITRE ATT&CK technique explanations
   - Vulnerability prioritization
   - Incident response guidance

3. **Database Queries**: When the context includes database results, analyze and explain the findings in a clear, actionable way.

**Response Guidelines:**
- Be conversational and helpful
- Use markdown formatting for better readability
- Provide specific, actionable advice when asked
- For security topics, reference MITRE ATT&CK techniques when relevant (format: TXXXX like T1566, T1486)
- Balance technical depth with accessibility
- If you don't know something, admit it honestly

**Current Date:** ${new Date().toISOString().split('T')[0]}

Remember: You have access to real-time security data when provided in the context, combined with Gemini's broad knowledge base.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: 'missing_api_key',
          message: 'AI service requires a Gemini API key. Please configure GEMINI_API_KEY in your Edge Function secrets.',
          hint: 'Get your API key from https://makersuite.google.com/app/apikey'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { messages, context }: ChatRequest = await req.json();

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build conversation text
    let conversationText = messages
      .filter(m => m.role !== 'system')
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n\n');

    // Build context section if available
    let contextSection = '';
    if (context) {
      contextSection = '\n\n**Security Database Context:**\n';
      contextSection += `- Total Incidents: ${context.incidents || 0}\n`;
      contextSection += `- Open Incidents: ${context.criticalAlerts || 0} critical\n`;
      contextSection += `- Total Assets: ${context.assets || 0}\n`;
      contextSection += `- Active Threat Intel: ${context.threats || 0} IOCs\n`;

      if (context.databaseContext) {
        const db = context.databaseContext;
        if (db.incidents && Array.isArray(db.incidents) && db.incidents.length > 0) {
          contextSection += `\n**Recent Incidents:**\n`;
          (db.incidents as Record<string, unknown>[]).slice(0, 3).forEach((inc, i) => {
            contextSection += `${i + 1}. ${inc.title} (${inc.severity}) - ${inc.status}\n`;
          });
        }
        if (db.assets && Array.isArray(db.assets) && db.assets.length > 0) {
          contextSection += `\n**Top Risk Assets:**\n`;
          (db.assets as Record<string, unknown>[]).slice(0, 3).forEach((asset, i) => {
            contextSection += `${i + 1}. ${asset.name} (Risk: ${asset.risk_score})\n`;
          });
        }
        if (db.threat_intel && Array.isArray(db.threat_intel) && db.threat_intel.length > 0) {
          contextSection += `\n**Recent Threat Intelligence:**\n`;
          (db.threat_intel as Record<string, unknown>[]).slice(0, 3).forEach((t, i) => {
            contextSection += `${i + 1}. ${t.ioc_value} (${t.ioc_type})\n`;
          });
        }
      }
    }

    const fullPrompt = `${SYSTEM_PROMPT}${contextSection}

**Conversation:**
${conversationText}

Assistant:`;

    // Call Gemini API with model that has knowledge of the world
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: fullPrompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);

      // Fallback to older model if 2.0 flash not available
      const fallbackResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
          }),
        }
      );

      if (!fallbackResponse.ok) {
        return new Response(
          JSON.stringify({ error: 'AI service error', message: 'Unable to connect to Gemini AI' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const fallbackData = await fallbackResponse.json();
      const fallbackText = fallbackData.candidates?.[0]?.content?.parts?.[0]?.text;

      return new Response(
        JSON.stringify({
          message: fallbackText || 'I apologize, I could not generate a response.',
          model: 'gemini-1.5-flash',
          timestamp: new Date().toISOString()
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, I could not generate a response.';

    return new Response(
      JSON.stringify({
        message: generatedText,
        model: 'gemini-2.0-flash',
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again.'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
