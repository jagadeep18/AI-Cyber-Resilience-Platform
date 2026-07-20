'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Radar,
  Target,
  ArrowRight,
  Network,
  Activity,
  Shield,
  AlertTriangle,
  Zap,
  Clock,
  Server,
  Lock,
  Unlock,
  TrendingUp,
  Crosshair,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ComposedChart, Bar
} from 'recharts';

interface AttackStage {
  stage: string;
  mitreTactic: string;
  techniques: string[];
  detected: boolean;
  confidence: number;
  timestamp?: string;
  evidence: string[];
}

interface ProgressionPrediction {
  id: string;
  nextStage: string;
  probability: number;
  timeframe: string;
  indicators: string[];
  recommendations: string[];
}

const killChainStages: AttackStage[] = [
  {
    stage: 'Reconnaissance',
    mitreTactic: 'Reconnaissance',
    techniques: ['T1591', 'T1595'],
    detected: true,
    confidence: 0.72,
    timestamp: '2026-07-05 08:23:00',
    evidence: ['External port scanning', 'WHOIS lookups for domain info'],
  },
  {
    stage: 'Resource Development',
    mitreTactic: 'Resource Development',
    techniques: ['T1583', 'T1587'],
    detected: false,
    confidence: 0.45,
    evidence: ['Infrastructure timing patterns suggest preparation'],
  },
  {
    stage: 'Initial Access',
    mitreTactic: 'Initial Access',
    techniques: ['T1566.001', 'T1199'],
    detected: true,
    confidence: 0.94,
    timestamp: '2026-07-06 09:15:22',
    evidence: ['Phishing email with malicious macro', 'Downloaded Cobalt Strike beacon'],
  },
  {
    stage: 'Execution',
    mitreTactic: 'Execution',
    techniques: ['T1059.001', 'T1053.005'],
    detected: true,
    confidence: 0.91,
    timestamp: '2026-07-06 09:18:45',
    evidence: ['PowerShell encoded command', 'Scheduled task creation'],
  },
  {
    stage: 'Persistence',
    mitreTactic: 'Persistence',
    techniques: ['T1546.001', 'T1547'],
    detected: true,
    confidence: 0.88,
    timestamp: '2026-07-06 09:24:12',
    evidence: ['Registry run key modification', 'Service installation'],
  },
  {
    stage: 'Privilege Escalation',
    mitreTactic: 'Privilege Escalation',
    techniques: ['T1548', 'T1068'],
    detected: true,
    confidence: 0.92,
    timestamp: '2026-07-06 09:31:55',
    evidence: ['UAC bypass', 'Service account added to Domain Admins'],
  },
  {
    stage: 'Defense Evasion',
    mitreTactic: 'Defense Evasion',
    techniques: ['T1055', 'T1562.001'],
    detected: true,
    confidence: 0.87,
    timestamp: '2026-07-06 09:35:08',
    evidence: ['Process injection into svchost.exe', 'Disabled Windows Defender'],
  },
  {
    stage: 'Credential Access',
    mitreTactic: 'Credential Access',
    techniques: ['T1003.001', 'T1558'],
    detected: true,
    confidence: 0.94,
    timestamp: '2026-07-06 09:42:31',
    evidence: ['LSASS memory dump', 'Kerberos ticket extraction'],
  },
  {
    stage: 'Discovery',
    mitreTactic: 'Discovery',
    techniques: ['T1018', 'T1087', 'T1482'],
    detected: true,
    confidence: 0.89,
    timestamp: '2026-07-06 09:48:12',
    evidence: ['Domain enumeration', 'Network topology mapping'],
  },
  {
    stage: 'Lateral Movement',
    mitreTactic: 'Lateral Movement',
    techniques: ['T1021.001', 'T1550.001'],
    detected: true,
    confidence: 0.91,
    timestamp: '2026-07-06 10:15:22',
    evidence: ['SMB authentication to OT segment', 'Pass-the-hash to SCADA gateway'],
  },
  {
    stage: 'Collection',
    mitreTactic: 'Collection',
    techniques: ['T1560', 'T1005'],
    detected: true,
    confidence: 0.82,
    timestamp: '2026-07-06 10:42:11',
    evidence: ['Database queries increased 847%', 'File staging directory created'],
  },
  {
    stage: 'Command & Control',
    mitreTactic: 'Command & Control',
    techniques: ['T1071.001', 'T1568.002'],
    detected: true,
    confidence: 0.94,
    timestamp: '2026-07-06 10:48:33',
    evidence: ['HTTPS beacon to 185.234.72.45', '5-minute heartbeat pattern'],
  },
  {
    stage: 'Exfiltration',
    mitreTactic: 'Exfiltration',
    techniques: ['T1041', 'T1567.002'],
    detected: false,
    confidence: 0.68,
    evidence: ['C2 channel capable of download', 'Staged files detected'],
  },
  {
    stage: 'Impact',
    mitreTactic: 'Impact',
    techniques: ['T1486', 'T1490'],
    detected: false,
    confidence: 0.31,
    evidence: ['Ransomware preparation indicators weak'],
  },
];

const predictions: ProgressionPrediction[] = [
  {
    id: 'pred1',
    nextStage: 'Exfiltration',
    probability: 87,
    timeframe: '2-4 hours',
    indicators: ['Staged files detected in staging directory', 'C2 channel capacity increased', 'Off-hours timing preferred'],
    recommendations: ['Block C2 IP at perimeter', 'Enable enhanced monitoring on affected hosts', 'Prepare incident response playbook'],
  },
  {
    id: 'pred2',
    nextStage: 'Impact (Ransomware)',
    probability: 42,
    timeframe: '6-12 hours',
    indicators: ['Encrypted file test patterns', 'Shadow copy deletion attempt blocked', 'Ransom note template found'],
    recommendations: ['Full backup verification', 'OT segment isolation recommended', 'Executive notification advised'],
  },
  {
    id: 'pred3',
    nextStage: 'OT System Compromise',
    probability: 78,
    timeframe: '1-3 hours',
    indicators: ['SCADA authentication obtained', 'OT firewall rules researched', 'PLC write capability confirmed'],
    recommendations: ['Emergency OT segment isolation', 'SCADA system backup', 'Emergency response team activation'],
  },
];

const progressionTimeline = [
  { time: '09:00', stage: 1, detected: 1 },
  { time: '10:00', stage: 3, detected: 2 },
  { time: '11:00', stage: 5, detected: 3 },
  { time: '12:00', stage: 7, detected: 4 },
  { time: '13:00', stage: 9, detected: 5 },
  { time: '14:00', stage: 11, detected: 6 },
];

const velocityData = [
  { hour: '10:00', techniques: 2, velocity: 0.7 },
  { hour: '11:00', techniques: 4, velocity: 1.4 },
  { hour: '12:00', techniques: 7, velocity: 2.1 },
  { hour: '13:00', techniques: 9, velocity: 2.8 },
  { hour: '14:00', techniques: 12, velocity: 3.9 },
];

export default function AttackProgressionPage() {
  const [selectedStage, setSelectedStage] = useState<AttackStage | null>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<ProgressionPrediction | null>(null);

  const getStageIcon = (detected: boolean, confidence: number) => {
    if (detected) {
      return confidence > 0.9 ? <AlertTriangle className="h-5 w-5 text-destructive" /> : <Activity className="h-5 w-5 text-warning" />;
    }
    return <Shield className="h-5 w-5 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attack Progression Mapping</h1>
          <p className="text-muted-foreground">MITRE ATT&CK framework mapping and next-stage prediction</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="gap-1">
            <Target className="h-3 w-3" />
            12 stages detected
          </Badge>
          <Badge className="bg-destructive text-white gap-1">
            <Radar className="h-3 w-3" />
            Active Prediction Mode
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Stage</p>
                <p className="text-3xl font-bold text-destructive">C&C</p>
              </div>
              <Crosshair className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Velocity</p>
                <p className="text-3xl font-bold text-warning">3.9/h</p>
              </div>
              <TrendingUp className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">TTI Exfiltration</p>
                <p className="text-3xl font-bold text-primary">2.3h</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-success/30 bg-success/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Containment Ready</p>
                <p className="text-3xl font-bold text-success">78%</p>
              </div>
              <Shield className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="killchain" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="killchain">Kill Chain Progression</TabsTrigger>
          <TabsTrigger value="predictions">Next-Stage Prediction</TabsTrigger>
          <TabsTrigger value="velocity">Attack Velocity</TabsTrigger>
          <TabsTrigger value="timeline">Timeline Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="killchain" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Cyber Kill Chain - Attack Progression
              </CardTitle>
              <CardDescription>
                Detection status across all MITRE ATT&CK tactics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-1 overflow-x-auto pb-4">
                {killChainStages.map((stage, idx) => (
                  <div
                    key={stage.stage}
                    className={`flex flex-col items-center cursor-pointer transition-all min-w-[80px] ${
                      selectedStage?.stage === stage.stage ? 'scale-105' : ''
                    }`}
                    onClick={() => setSelectedStage(stage)}
                  >
                    <div className={`relative flex flex-col items-center`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        stage.detected ? (stage.confidence > 0.9 ? 'bg-destructive' : 'bg-warning') : 'bg-muted'
                      }`}>
                        {getStageIcon(stage.detected, stage.confidence)}
                      </div>
                      {idx < killChainStages.length - 1 && (
                        <div className={`absolute left-[100%] top-1/2 w-4 h-0.5 ${
                          killChainStages[idx + 1].detected ? 'bg-destructive' : 'bg-muted'
                        }`} />
                      )}
                    </div>
                    <span className={`text-xs mt-2 text-center ${
                      stage.detected ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {stage.stage.length > 8 ? stage.stage.slice(0, 8) + '...' : stage.stage}
                    </span>
                    {stage.detected && (
                      <span className="text-[10px] text-primary">
                        {Math.round(stage.confidence * 100)}%
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {selectedStage && (
                <Card className="mt-4 border-primary/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{selectedStage.stage}</CardTitle>
                    <CardDescription>
                      MITRE Tactic: {selectedStage.mitreTactic}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {selectedStage.techniques.map((tech) => (
                        <Badge key={tech} variant="outline" className="font-mono">{tech}</Badge>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Evidence:</p>
                      <ul className=" text-sm text-muted-foreground">
                        {selectedStage.evidence.map((ev, idx) => (
                          <li key={idx}>• {ev}</li>
                        ))}
                      </ul>
                    </div>
                    {selectedStage.timestamp && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Detected at: {selectedStage.timestamp}</span>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Confidence Level</p>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${selectedStage.confidence > 0.9 ? 'bg-destructive' : selectedStage.confidence > 0.7 ? 'bg-warning' : 'bg-success'}`}
                          style={{ width: `${selectedStage.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid gap-4">
            {predictions.map((pred) => (
              <Card
                key={pred.id}
                className={`cursor-pointer transition-all ${selectedPrediction?.id === pred.id ? 'border-primary bg-primary/5' : ''}`}
                onClick={() => setSelectedPrediction(pred)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                      pred.probability > 70 ? 'bg-destructive/20' : pred.probability > 40 ? 'bg-warning/20' : 'bg-success/20'
                    }`}>
                      <span className={`text-2xl font-bold ${
                        pred.probability > 70 ? 'text-destructive' : pred.probability > 40 ? 'text-warning' : 'text-success'
                      }`}>
                        {pred.probability}%
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <ArrowRight className="h-4 w-4 text-primary" />
                        <span className="font-medium">Next: {pred.nextStage}</span>
                        <Badge variant="outline">{pred.timeframe}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {pred.indicators.slice(0, 2).map((ind, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">{ind}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="w-24">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${pred.probability > 70 ? 'bg-destructive' : pred.probability > 40 ? 'bg-warning' : 'bg-success'}`}
                          style={{ width: `${pred.probability}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-1">Probability</p>
                    </div>
                  </div>

                  {selectedPrediction?.id === pred.id && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium mb-2">Recommended Actions</h4>
                      <div className="grid gap-2">
                        {pred.recommendations.map((rec, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <Zap className="h-4 w-4 text-primary" />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                      <Button className="mt-4" size="sm">
                        <Shield className="h-4 w-4 mr-2" />
                        Execute Containment Actions
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="velocity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attack Velocity Analysis</CardTitle>
              <CardDescription>
                Rate of technique progression through kill chain stages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={velocityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="hour" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis yAxisId="left" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar yAxisId="left" dataKey="techniques" name="Techniques" fill="#ef4444" />
                    <Line yAxisId="right" type="monotone" dataKey="velocity" stroke="#eab308" strokeWidth={2} name="Velocity" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <span className="font-medium">High Velocity Alert</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Attack velocity of 3.9 techniques/hour indicates an automated or highly skilled threat actor.
                  APT-level progression pattern detected - immediate intervention required.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attack Timeline</CardTitle>
              <CardDescription>
                Stages detected over time with detection confidence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progressionTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area type="monotone" dataKey="stage" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="Kill Chain Stage" />
                    <Area type="monotone" dataKey="detected" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} name="Detections" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-4">
                  {killChainStages.filter(s => s.detected).map((stage, idx) => (
                    <div key={stage.stage} className="flex items-start gap-4 pl-10 relative">
                      <div className={`absolute left-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        stage.confidence > 0.9 ? 'bg-destructive text-white' : 'bg-warning text-black'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 p-3 rounded-lg bg-muted/50 border">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{stage.stage}</span>
                          <Badge variant="outline" className="text-xs">{stage.mitreTactic}</Badge>
                          <span className="text-xs text-muted-foreground ml-auto">{stage.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Confidence: {Math.round(stage.confidence * 100)}%
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {stage.techniques.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
