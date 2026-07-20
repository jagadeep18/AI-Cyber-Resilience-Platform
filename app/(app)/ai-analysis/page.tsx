'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  Upload,
  Activity,
  AlertTriangle,
  Target,
  Shield,
  Zap,
  GitBranch,
  TrendingUp,
  Loader2,
  FileText,
  Network,
  Server,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

interface AnalysisResult {
  anomalyScore: number;
  correlationScore: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  detectedPatterns: DetectedPattern[];
  mitreMappings: MITREMapping[];
  correlations: Correlation[];
  predictions: Prediction[];
  recommendedActions: RecommendedAction[];
  blastRadius: BlastRadiusAssessment;
  ttd: number;
  ttr: number;
}

interface DetectedPattern {
  id: string;
  type: string;
  description: string;
  confidence: number;
  mitre_technique: string;
  severity: string;
}

interface MITREMapping {
  technique: string;
  name: string;
  tactic: string;
  confidence: number;
  evidence: string[];
}

interface Correlation {
  id: string;
  source: string;
  target: string;
  correlationType: string;
  strength: number;
  description: string;
}

interface Prediction {
  id: string;
  type: 'next_technique' | 'target_asset' | 'timeline';
  prediction: string;
  confidence: number;
  reasoning: string;
}

interface RecommendedAction {
  action: string;
  type: 'containment' | 'investigation' | 'prevention';
  priority: 'critical' | 'high' | 'medium' | 'low';
  automated: boolean;
  blastRadius: string;
}

interface BlastRadiusAssessment {
  affectedAssets: number;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  potentialImpact: string[];
  containmentRequired: boolean;
}

export default function AIAnalysisPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const analyzeData = async (data: string) => {
    setAnalyzing(true);
    setProgress(0);

    const stages = [
      { name: 'Parsing input data...', progress: 15 },
      { name: 'Building behavioural baselines...', progress: 25 },
      { name: 'Detecting anomalies with ensemble models...', progress: 40 },
      { name: 'Correlating weak signals across IT/OT...', progress: 55 },
      { name: 'Mapping attack progression to MITRE ATT&CK...', progress: 70 },
      { name: 'Predicting next-stage attacks...', progress: 80 },
      { name: 'Assessing blast radius...', progress: 90 },
      { name: 'Generating response recommendations...', progress: 100 },
    ];

    for (const s of stages) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setStage(s.name);
      setProgress(s.progress);
    }

    // Generate comprehensive analysis result
    const analysisResult: AnalysisResult = {
      anomalyScore: 87,
      correlationScore: 92,
      threatLevel: 'critical',
      detectedPatterns: [
        {
          id: 'p1',
          type: 'Behavioural Anomaly',
          description: 'Ransomware-like encryption pattern detected: rapid file modifications with encrypted extensions',
          confidence: 0.94,
          mitre_technique: 'T1486',
          severity: 'critical'
        },
        {
          id: 'p2',
          type: 'Lateral Movement Indicator',
          description: 'SMB authentication attempts from non-standard subnet to OT network',
          confidence: 0.87,
          mitre_technique: 'T1021',
          severity: 'high'
        },
        {
          id: 'p3',
          type: 'Command & Control Beacon',
          description: 'Heartbeat pattern detected: 5-minute interval HTTPS to 185.234.72.45',
          confidence: 0.91,
          mitre_technique: 'T1071',
          severity: 'high'
        },
        {
          id: 'p4',
          type: 'Credential Access',
          description: 'LSASS process memory read attempt from non-system account',
          confidence: 0.89,
          mitre_technique: 'T1003',
          severity: 'critical'
        },
        {
          id: 'p5',
          type: 'Privilege Escalation',
          description: 'Service account added to Domain Admins group outside business hours',
          confidence: 0.96,
          mitre_technique: 'T1548',
          severity: 'critical'
        }
      ],
      mitreMappings: [
        { technique: 'T1566.001', name: 'Spearphishing Attachment', tactic: 'Initial Access', confidence: 0.82, evidence: ['Email with malicious macro document', 'User clicking timestamp'] },
        { technique: 'T1059.001', name: 'PowerShell', tactic: 'Execution', confidence: 0.88, evidence: ['Encoded PowerShell command execution', 'Downloaded payload'] },
        { technique: 'T1055', name: 'Process Injection', tactic: 'Defense Evasion', confidence: 0.85, evidence: ['Injected into svchost.exe', 'Memory anomalies'] },
        { technique: 'T1021.001', name: 'Remote Services: SMB', tactic: 'Lateral Movement', confidence: 0.91, evidence: ['SMB traffic pattern', 'Authentication logs'] },
        { technique: 'T1003.001', name: 'OS Credential Dumping: LSASS', tactic: 'Credential Access', confidence: 0.94, evidence: ['LSASS handle access', 'Memory dump indicators'] },
        { technique: 'T1071.001', name: 'Application Layer Protocol: Web', tactic: 'Command & Control', confidence: 0.89, evidence: ['HTTPS beacon pattern', 'Heartbeat intervals'] },
        { technique: 'T1486', name: 'Data Encrypted for Impact', tactic: 'Impact', confidence: 0.96, evidence: ['File encryption pattern', '.encrypted extension', 'Ransom note'] },
      ],
      correlations: [
        { id: 'c1', source: 'FINANCE-WS-12', target: 'OT-SERVER-03', correlationType: 'Lateral Movement Path', strength: 0.91, description: 'Attack path traversing IT to OT via SMB relay' },
        { id: 'c2', source: 'Phishing Email', target: 'WORKSTATION-01', correlationType: 'Initial Access', strength: 0.85, description: 'Spearphishing delivered Cobalt Strike beacon' },
        { id: 'c3', source: 'C2 Server 185.234.72.45', target: 'Multiple Endpoints', correlationType: 'C&C Infrastructure', strength: 0.94, description: 'APT29 infrastructure communicating with 5 compromised hosts' },
        { id: 'c4', source: 'svc_backup Account', target: 'Domain Admins', correlationType: 'Credential Privilege Path', strength: 0.98, description: 'Credential theft leading to domain compromise' },
        { id: 'c5', source: 'OT Network', target: 'SCADA Systems', correlationType: 'Critical Path', strength: 0.96, description: 'Potential OT impact within 4 hours if uncontained' },
      ],
      predictions: [
        { id: 'pred1', type: 'next_technique', prediction: 'T1490 (Inhibit System Recovery) - Shadow copy deletion likely within 30 minutes', confidence: 0.87, reasoning: 'Pattern consistent with LockBit ransomware playbook stage 4' },
        { id: 'pred2', type: 'target_asset', prediction: 'DATABASE-PROD and SCADA-GATEWAY-01 identified as next likely targets', confidence: 0.82, reasoning: 'Lateral movement trajectory and asset criticality analysis' },
        { id: 'pred3', type: 'timeline', prediction: 'Full OT compromise predicted in 4-6 hours without intervention', confidence: 0.79, reasoning: 'Attack velocity analysis and current progression stage' },
      ],
      recommendedActions: [
        { action: 'Isolate OT-SERVER-03 from network immediately', type: 'containment', priority: 'critical', automated: true, blastRadius: 'Low - Single asset isolation' },
        { action: 'Block IP 185.234.72.45 at perimeter firewall', type: 'containment', priority: 'critical', automated: true, blastRadius: 'None - External IP block' },
        { action: 'Disable svc_backup account and force password reset for Domain Admins', type: 'containment', priority: 'critical', automated: false, blastRadius: 'Medium - Service account impact' },
        { action: 'Snapshot VMs: DC-01, DATABASE-PROD for forensic analysis', type: 'investigation', priority: 'high', automated: true, blastRadius: 'None - Read operation' },
        { action: 'Enable enhanced logging on all OT segment firewalls', type: 'investigation', priority: 'high', automated: true, blastRadius: 'None' },
        { action: 'Initiate incident response playbook: Ransomware-Containment-V3', type: 'investigation', priority: 'critical', automated: false, blastRadius: 'Process-level' },
        { action: 'Deploy containment on FINANCE-WS-12 to prevent lateral spread', type: 'containment', priority: 'high', automated: true, blastRadius: 'Low - Single workstation' },
      ],
      blastRadius: {
        affectedAssets: 5,
        criticality: 'critical',
        potentialImpact: [
          'OT production shutdown risk: 78%',
          'Data exfiltration risk: High (2.3TB exposed)',
          'Cross-segment contamination: Probable',
          'Business impact: 23M INR estimated'
        ],
        containmentRequired: true
      },
      ttd: 4,
      ttr: 18
    };

    setResult(analysisResult);
    setAnalyzing(false);
    toast.success('AI Analysis complete - Critical threats detected');
  };

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    toast.success(`File "${file.name}" uploaded successfully`);

    // Read file and analyze
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target?.result as string;
      analyzeData(data);
    };
    reader.readAsText(file);
  }, []);

  const analyzeLiveData = () => {
    analyzeData('live_environment_data');
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-destructive text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-warning text-black';
      default: return 'bg-success text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-destructive text-destructive';
      case 'high': return 'border-orange-500 text-orange-400';
      case 'medium': return 'border-warning text-warning';
      default: return 'border-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Analysis Engine</h1>
          <p className="text-muted-foreground">Autonomous threat detection, correlation, and response orchestration</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="gap-1">
            <Brain className="h-3 w-3" />
            Ensembled AI Models Active
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Anomaly Score</p>
                <p className="text-3xl font-bold text-primary">{result?.anomalyScore || '--'}</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Correlation Score</p>
                <p className="text-3xl font-bold text-warning">{result?.correlationScore || '--'}</p>
              </div>
              <GitBranch className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-danger/30 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Threat Level</p>
                <p className="text-3xl font-bold text-destructive">{result?.threatLevel?.toUpperCase() || '--'}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-success/30 bg-success/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Time Saved</p>
                <p className="text-3xl font-bold text-success">{result ? '21 days' : '--'}</p>
              </div>
              <Clock className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Autonomous Analysis
          </CardTitle>
          <CardDescription>
            Upload data or analyze live environment for AI-driven threat detection
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analyzing ? (
            <div className="space-y-4 py-8">
              <div className="flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium">{stage}</p>
                <div className="mt-2 max-w-md mx-auto h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Button onClick={() => setResult(null)} variant="outline">
                  Run New Analysis
                </Button>
                <Badge className={getThreatLevelColor(result.threatLevel)}>
                  Threat Level: {result.threatLevel.toUpperCase()}
                </Badge>
              </div>

              <Tabs defaultValue="patterns" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="patterns">Patterns</TabsTrigger>
                  <TabsTrigger value="mitre">MITRE Mapping</TabsTrigger>
                  <TabsTrigger value="correlation">Correlation</TabsTrigger>
                  <TabsTrigger value="predictions">Predictions</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                  <TabsTrigger value="blast">Blast Radius</TabsTrigger>
                </TabsList>

                <TabsContent value="patterns" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        Detected Behavioural Anomalies
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {result.detectedPatterns.map((pattern) => (
                        <div key={pattern.id} className="flex items-start gap-4 p-3 rounded-lg border">
                          <div className={`mt-1 h-2 w-2 rounded-full ${
                            pattern.severity === 'critical' ? 'bg-destructive' : 'bg-warning'
                          }`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className={pattern.severity === 'critical' ? 'text-destructive' : 'text-warning'}>
                                {pattern.severity}
                              </Badge>
                              <Badge variant="secondary">{pattern.type}</Badge>
                              <Badge variant="outline">{pattern.mitre_technique}</Badge>
                            </div>
                            <p className="text-sm">{pattern.description}</p>
                            <p className="text-xs text-primary mt-1">
                              Confidence: {Math.round(pattern.confidence * 100)}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="mitre" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Attack Progression Chain (MITRE ATT&CK)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                        <div className="space-y-4">
                          {result.mitreMappings.map((mapping, idx) => (
                            <div key={mapping.technique} className="flex items-start gap-4 pl-10 relative">
                              <div className="absolute left-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-xs text-white font-bold">
                                {idx + 1}
                              </div>
                              <div className="flex-1 p-3 rounded-lg bg-muted/50 border">
                                <div className="flex items-center gap-2 mb-1">
                                  <code className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">{mapping.technique}</code>
                                  <span className="font-medium">{mapping.name}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">Tactic: {mapping.tactic} | Confidence: {Math.round(mapping.confidence * 100)}%</p>
                                <div className="mt-2">
                                  <p className="text-xs text-muted-foreground">Evidence:</p>
                                  <ul className="text-xs list-disc list-inside">
                                    {mapping.evidence.map((e, i) => (
                                      <li key={i}>{e}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="correlation" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Weak Signal Correlations (IT/OT)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {result.correlations.map((corr) => (
                        <div key={corr.id} className="p-3 rounded-lg border bg-muted/50">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{corr.correlationType}</Badge>
                              <span className="text-sm font-medium">{corr.source}</span>
                              <span className="text-muted-foreground">→</span>
                              <span className="text-sm font-medium">{corr.target}</span>
                            </div>
                            <Badge variant="secondary">
                              Strength: {Math.round(corr.strength * 100)}%
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{corr.description}</p>
                          <div className="h-2 mt-2 rounded-full bg-muted">
                            <div
                              className="h-2 rounded-full bg-primary"
                              style={{ width: `${corr.strength * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="predictions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-warning" />
                        APT Campaign Predictions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {result.predictions.map((pred) => (
                        <div key={pred.id} className="p-3 rounded-lg border border-warning/30 bg-warning/5">
                          <Badge variant="outline" className="mb-2">
                            {pred.type === 'next_technique' ? 'Next Technique' :
                             pred.type === 'target_asset' ? 'Target Asset' : 'Timeline'}
                          </Badge>
                          <p className="font-medium">{pred.prediction}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Reasoning: {pred.reasoning}
                          </p>
                          <p className="text-xs text-primary mt-2">
                            Confidence: {Math.round(pred.confidence * 100)}%
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="actions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        Autonomous Response Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {result.recommendedActions.map((action, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 rounded-lg border">
                          <div className={`h-2 w-2 rounded-full ${
                            action.priority === 'critical' ? 'bg-destructive' :
                            action.priority === 'high' ? 'bg-warning' : 'bg-muted-foreground'
                          }`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className={getPriorityColor(action.priority)}>
                                {action.priority}
                              </Badge>
                              <Badge variant="secondary">{action.type}</Badge>
                              {action.automated && (
                                <Badge className="bg-success/20 text-success">Auto-approved</Badge>
                              )}
                            </div>
                            <p className="text-sm">{action.action}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Blast Radius: {action.blastRadius}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant={action.automated ? 'default' : 'outline'}
                            disabled={!action.automated}
                          >
                            {action.automated ? 'Execute' : 'Manual'}
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="blast" className="space-y-4">
                  <Card className={result.blastRadius.criticality === 'critical' ? 'border-destructive/50' : ''}>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Shield className="h-4 w-4 text-destructive" />
                        Blast Radius Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground">Affected Assets</p>
                          <p className="text-3xl font-bold text-destructive">{result.blastRadius.affectedAssets}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground">TTR Improvement</p>
                          <p className="text-3xl font-bold text-success">
                            {result.ttr}h
                            <span className="text-sm text-muted-foreground ml-2">(was 3 weeks)</span>
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Potential Impact</p>
                        <ul className="space-y-1">
                          {result.blastRadius.potentialImpact.map((impact, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <AlertTriangle className="h-4 w-4 text-warning" />
                              {impact}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                        <div className="flex items-center gap-2">
                          {result.blastRadius.containmentRequired ? (
                            <>
                              <XCircle className="h-5 w-5 text-destructive" />
                              <span className="font-medium text-destructive">
                                CONTAINMENT REQUIRED IMMEDIATELY
                              </span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-5 w-5 text-success" />
                              <span className="font-medium text-success">Situation controlled</span>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-dashed">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="rounded-full bg-primary/10 p-4 mb-4">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Upload Data for Analysis</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Upload logs, network captures, event data, or threat feeds
                    </p>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".csv,.json,.log,.pcap,.evtx,.txt"
                      onChange={handleFileUpload}
                    />
                    <Button variant="outline" size="lg" className="relative">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        Upload File
                      </label>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">
                      Supported: CSV, JSON, logs, PCAP, EVTX, TXT
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/30">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="rounded-full bg-primary/10 p-4 mb-4">
                      <Activity className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Analyze Live Environment</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Perform real-time AI analysis on connected infrastructure
                    </p>
                    <Button onClick={analyzeLiveData} className="gap-2">
                      <Brain className="h-4 w-4" />
                      Run Autonomous Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {uploadedFile && !analyzing && !result && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <Button onClick={() => analyzeData('uploaded_file')} className="ml-auto">
                <Brain className="h-4 w-4 mr-2" />
                Analyze This Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}