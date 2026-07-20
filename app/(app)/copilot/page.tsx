'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Brain,
  Send,
  Bot,
  User,
  AlertTriangle,
  Shield,
  Activity,
  Search,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RefreshCw,
  XCircle,
  CheckCircle2,
  Zap,
  Database,
  Server,
  Network,
  Clock,
  TrendingUp,
  Lock,
  FileText,
  Globe,
  Settings,
  Key,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  sources?: { title: string; url: string }[];
  mitre_refs?: string[];
  confidence?: number;
  issues?: DetectedIssue[];
  type?: 'info' | 'warning' | 'error' | 'success' | 'analysis';
  data?: Record<string, unknown>;
  isStreaming?: boolean;
}

interface DetectedIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  impact: string;
  solution: string;
  affectedAssets?: string[];
  dataLossRisk: boolean;
}

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [dataStats, setDataStats] = useState({
    incidents: 0,
    openIncidents: 0,
    criticalIncidents: 0,
    assets: 0,
    compromisedAssets: 0,
    threatIntelCount: 0,
    activeThreats: 0,
  });
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'configured' | 'missing'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDataStats();
    checkApiKeyStatus();

    // Add welcome message
    setMessages([{
      id: 'welcome',
      role: 'system',
      content: `## 🤖 SentinelX AI Copilot

Welcome to your AI-powered security analyst assistant. I can help you:

- **Analyze incidents** and provide risk assessments
- **Investigate threats** and explain MITRE ATT&CK techniques
- **Query your security database** for real-time data
- **Generate response recommendations** for active incidents
- **Explain cybersecurity concepts** and best practices

**Try asking:**
- "What are the most critical incidents right now?"
- "Explain MITRE technique T1566"
- "How should I respond to a ransomware attack?"
- "What is lateral movement and how do I detect it?"

I use Google Gemini AI for intelligent analysis combined with your live security database.`,
      timestamp: new Date(),
      type: 'info',
    }]);

    const interval = setInterval(fetchDataStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkApiKeyStatus = async () => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const response = await fetch(`${supabaseUrl}/functions/v1/ai-copilot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [] }),
      });

      const data = await response.json();
      setApiKeyStatus(data.error === 'missing_api_key' ? 'missing' : 'configured');
    } catch {
      setApiKeyStatus('configured');
    }
  };

  const fetchDataStats = async () => {
    try {
      const [
        incidentsRes,
        openRes,
        criticalRes,
        assetsRes,
        compromisedRes,
        threatIntelRes,
      ] = await Promise.all([
        supabase.from('incidents').select('*', { count: 'exact', head: true }),
        supabase.from('incidents').select('*', { count: 'exact', head: true }).eq('status', 'open'),
        supabase.from('incidents').select('*', { count: 'exact', head: true }).eq('severity', 'critical'),
        supabase.from('assets').select('*', { count: 'exact', head: true }),
        supabase.from('assets').select('*', { count: 'exact', head: true }).eq('is_compromised', true),
        supabase.from('threat_intel').select('*', { count: 'exact', head: true }).eq('is_active', true),
      ]);

      setDataStats({
        incidents: incidentsRes.count || 0,
        openIncidents: openRes.count || 0,
        criticalIncidents: criticalRes.count || 0,
        assets: assetsRes.count || 0,
        compromisedAssets: compromisedRes.count || 0,
        threatIntelCount: threatIntelRes.count || 0,
        activeThreats: 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchDatabaseContext = async (query: string): Promise<Record<string, unknown>> => {
    const queryLower = query.toLowerCase();
    const context: Record<string, unknown> = {};

    try {
      if (queryLower.includes('incident') || queryLower.includes('alert')) {
        const { data } = await supabase
          .from('incidents')
          .select('*')
          .order('first_detected', { ascending: false })
          .limit(5);
        context.incidents = data;
      }

      if (queryLower.includes('asset') || queryLower.includes('server') || queryLower.includes('compromised')) {
        const { data } = await supabase
          .from('assets')
          .select('*')
          .order('risk_score', { ascending: false })
          .limit(5);
        context.assets = data;
      }

      if (queryLower.includes('threat') || queryLower.includes('ioc') || queryLower.includes('intel')) {
        const { data } = await supabase
          .from('threat_intel')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(5);
        context.threat_intel = data;
      }

      if (queryLower.includes('ueba') || queryLower.includes('behavior') || queryLower.includes('anomaly')) {
        const { data } = await supabase
          .from('ueba_events')
          .select('*')
          .order('detected_at', { ascending: false })
          .limit(5);
        context.ueba_events = data;
      }

      if (queryLower.includes('ransomware') || queryLower.includes('malware')) {
        const { data } = await supabase
          .from('incidents')
          .select('*')
          .eq('category', 'ransomware');
        context.ransomware_incidents = data;
      }

    } catch (error) {
      console.error('Error fetching database context:', error);
    }

    return context;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Fetch database context for relevant queries
      const dbContext = await fetchDatabaseContext(input);

      // Prepare messages for API
      const conversationMessages = messages
        .filter(m => m.role !== 'system')
        .map(m => ({ role: m.role, content: m.content }));
      conversationMessages.push({ role: 'user', content: userMessage.content });

      // Call the AI Copilot edge function
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const response = await fetch(`${supabaseUrl}/functions/v1/ai-copilot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          messages: conversationMessages,
          context: {
            incidents: dataStats.incidents,
            assets: dataStats.assets,
            threats: dataStats.threatIntelCount,
            criticalAlerts: dataStats.criticalIncidents,
            databaseContext: dbContext,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      // If API key is missing, provide a fallback response
      if (data.error === 'missing_api_key') {
        setApiKeyStatus('missing');
        const fallbackContent = generateFallbackResponse(userMessage.content, dbContext, dataStats);

        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: fallbackContent,
          timestamp: new Date(),
          type: 'warning',
        }]);
      } else {
        setApiKeyStatus('configured');

        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message || 'I apologize, I could not process your request.',
          timestamp: new Date(),
          data: dbContext,
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Fallback to database-only response
      const dbContext = await fetchDatabaseContext(userMessage.content);
      const fallbackContent = generateFallbackResponse(userMessage.content, dbContext, dataStats);

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackContent + '\n\n⚠️ **Note:** AI service temporarily unavailable. Showing database-only results.',
        timestamp: new Date(),
        type: 'warning',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackResponse = (
    query: string,
    dbContext: Record<string, unknown>,
    stats: typeof dataStats
  ): string => {
    const queryLower = query.toLowerCase();

    if (queryLower.includes('incident') || queryLower.includes('alert')) {
      const incidents = dbContext.incidents as Array<Record<string, unknown>> | undefined;
      if (incidents && incidents.length > 0) {
        return `## 📊 Incident Analysis

**Live Database Query Results:**

| # | Title | Severity | Status | Detected |
|---|-------|----------|--------|----------|
${incidents.slice(0, 5).map((inc, i) =>
  `| ${i + 1} | ${inc.title} | ${inc.severity} | ${inc.status} | ${new Date(inc.first_detected as string).toLocaleDateString()} |`
).join('\n')}

**Statistics:**
- Total Incidents: ${stats.incidents}
- Open Incidents: ${stats.openIncidents}
- Critical Incidents: ${stats.criticalIncidents}

${stats.criticalIncidents > 0 ? '⚠️ **Action Required:** Critical incidents need immediate attention.' : '✅ No critical incidents at this time.'}`;
      }
      return `## 📊 Incident Analysis

No incidents found in the database. The system is clear of active security incidents.`;
    }

    if (queryLower.includes('asset') || queryLower.includes('server')) {
      const assets = dbContext.assets as Array<Record<string, unknown>> | undefined;
      if (assets && assets.length > 0) {
        return `## 💻 Asset Inventory

**Top Risk Assets:**

| Name | Type | Risk Score | Status |
|------|------|------------|--------|
${assets.slice(0, 5).map((asset) =>
  `| ${asset.name} | ${asset.type} | ${asset.risk_score} | ${asset.is_compromised ? '🔴 Compromised' : asset.is_isolated ? '🟡 Isolated' : '✅ Secure'} |`
).join('\n')}

**Statistics:**
- Total Assets: ${stats.assets}
- Compromised: ${stats.compromisedAssets}

${stats.compromisedAssets > 0 ? '⚠️ **Action Required:** Isolate compromised assets immediately.' : '✅ All assets operating normally.'}`;
      }
      return `## 💻 Asset Inventory

No assets found in the database. Add assets through the Assets page.`;
    }

    if (queryLower.includes('threat') || queryLower.includes('ioc')) {
      const threats = dbContext.threat_intel as Array<Record<string, unknown>> | undefined;
      if (threats && threats.length > 0) {
        return `## 🔎 Threat Intelligence

**Active IOCs: ${threats.length}**

| Indicator | Type | Source | Confidence |
|-----------|------|--------|------------|
${threats.slice(0, 5).map((t) =>
  `| ${t.ioc_value} | ${t.ioc_type} | ${t.ioc_source} | ${Math.round((t.confidence as number) * 100)}% |`
).join('\n')}

Cross-reference these indicators with your network logs.`;
      }
      return `## 🔎 Threat Intelligence

No active threat intelligence indicators found.`;
    }

    if (queryLower.includes('ransomware')) {
      const ransomware = dbContext.ransomware_incidents as Array<Record<string, unknown>> | undefined;
      return `## 🦠 Ransomware Analysis

**Ransomware Incidents:** ${ransomware?.length || 0}

**Key MITRE ATT&CK Techniques:**
- T1486: Data Encrypted for Impact
- T1490: Inhibit System Recovery
- T1566.001: Spearphishing Attachment

**Recommended Actions:**
1. Isolate affected systems
2. Preserve evidence (don't reboot)
3. Block C2 communications
4. Verify backup integrity`;
    }

    return `## 🤖 SentinelX AI Copilot

I'm here to help with your security operations. While the AI service is being configured, I can still query your security database.

**Current Security Posture:**
- Incidents: ${stats.incidents} (${stats.criticalIncidents} critical)
- Assets: ${stats.assets} (${stats.compromisedAssets} compromised)
- Threat Intel: ${stats.threatIntelCount} active IOCs

Ask me about:
- Incidents and alerts
- Assets and their risk scores
- Threat intelligence
- Ransomware analysis
- UEBA anomalies`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content.replace(/[#*`]/g, ''));
    toast.success('Copied to clipboard');
  };

  const clearConversation = () => {
    setMessages([{
      id: 'cleared',
      role: 'system',
      content: '## 🤖 Conversation Cleared\n\nReady for a new conversation. How can I help you with your security operations?',
      timestamp: new Date(),
      type: 'info',
    }]);
    toast.success('Conversation cleared');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Copilot</h1>
          <p className="text-muted-foreground">Your AI-powered security analyst assistant</p>
        </div>
        <div className="flex items-center gap-3">
          {apiKeyStatus === 'configured' && (
            <Badge className="bg-success/20 text-success">
              <Brain className="h-3 w-3 mr-1" />
              AI Connected
            </Badge>
          )}
          {apiKeyStatus === 'missing' && (
            <Badge className="bg-warning/20 text-warning">
              <Database className="h-3 w-3 mr-1" />
              Database Mode
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={clearConversation}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="flex flex-col h-[calc(100vh-280px)]">
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role !== 'user' && (
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {message.role === 'system' ? (
                              <Shield className="h-4 w-4 text-primary" />
                            ) : (
                              <Bot className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : message.type === 'warning'
                            ? 'bg-warning/10 border border-warning/30'
                            : 'bg-muted'
                        }`}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          {message.content.split('\n').map((line, i) => (
                            <p key={i} className="mb-1">
                              {line.startsWith('##') ? (
                                <strong className="text-base">{line.replace(/## /, '')}</strong>
                              ) : line.startsWith('**') ? (
                                <strong>{line.replace(/\*\*/g, '')}</strong>
                              ) : (
                                line
                              )}
                            </p>
                          ))}
                        </div>
                        <p className="text-xs mt-2 opacity-60">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      {message.role === 'user' && (
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                            <User className="h-4 w-4 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about incidents, threats, assets, or security concepts..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                  {isLoading ? (
                    <Activity className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-sm">Incidents</span>
                </div>
                <Badge variant={dataStats.criticalIncidents > 0 ? 'destructive' : 'secondary'}>
                  {dataStats.incidents}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-primary" />
                  <span className="text-sm">Assets</span>
                </div>
                <Badge variant={dataStats.compromisedAssets > 0 ? 'destructive' : 'secondary'}>
                  {dataStats.assets}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-warning" />
                  <span className="text-sm">Threat Intel</span>
                </div>
                <Badge variant="secondary">{dataStats.threatIntelCount}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Suggested Queries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                'Show me all critical incidents',
                'What assets are compromised?',
                'Explain MITRE technique T1566',
                'How to respond to ransomware?',
                'What is lateral movement?',
              ].map((query, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs h-auto py-2"
                  onClick={() => setInput(query)}
                >
                  <Search className="h-3 w-3 mr-2 flex-shrink-0" />
                  {query}
                </Button>
              ))}
            </CardContent>
          </Card>

          {apiKeyStatus === 'missing' && (
            <Card className="border-warning/30 bg-warning/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Key className="h-4 w-4 text-warning" />
                  AI Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">
                  Add a Gemini API key to enable full AI capabilities with intelligent analysis.
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                    Get API Key
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Capabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-success" />
                Real-time database queries
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-success" />
                MITRE ATT&CK analysis
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-success" />
                Incident recommendations
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-success" />
                Threat intelligence lookup
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-success" />
                Asset risk assessment
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Message Detail Sheet */}
      <Sheet open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <SheetContent className="w-[500px] sm:max-w-[600px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {selectedMessage?.role === 'user' ? (
                <User className="h-5 w-5" />
              ) : (
                <Bot className="h-5 w-5 text-primary" />
              )}
              {selectedMessage?.role === 'user' ? 'Your Query' : 'AI Response'}
            </SheetTitle>
          </SheetHeader>
          {selectedMessage && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {selectedMessage.timestamp.toLocaleString()}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(selectedMessage.content)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {selectedMessage.content.split('\n').map((line, i) => (
                    <p key={i} className="mb-2">
                      {line.startsWith('##') ? (
                        <strong className="text-lg block mt-4">{line.replace(/## /, '')}</strong>
                      ) : line.startsWith('- ') ? (
                        <span className="block pl-4">{line}</span>
                      ) : (
                        line
                      )}
                    </p>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
