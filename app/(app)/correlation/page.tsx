'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  GitBranch,
  Network,
  Activity,
  AlertTriangle,
  Shield,
  Zap,
  TrendingUp,
  ArrowRight,
  Server,
  Cpu,
  Globe,
  Radio,
  Target,
  Users,
  Clock,
} from 'lucide-react';
import {
  Sankey,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

interface CorrelationSignal {
  id: string;
  source: 'IT' | 'OT' | 'Hybrid';
  type: string;
  description: string;
  timestamp: string;
  confidence: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

interface WeakSignal {
  id: string;
  signal: string;
  environment: 'IT' | 'OT';
  observation: string;
  deviation: number;
  correlatedWith: string[];
  threatIndicator: boolean;
}

const correlationSignals: CorrelationSignal[] = [
  {
    id: 'cs1',
    source: 'IT',
    type: 'Authentication Anomaly',
    description: 'Service account login from non-standard workstation',
    timestamp: '2026-07-06 14:23:15',
    confidence: 0.89,
    severity: 'high',
  },
  {
    id: 'cs2',
    source: 'OT',
    type: 'Protocol Violation',
    description: 'Modbus write to PLC outside maintenance window',
    timestamp: '2026-07-06 14:25:42',
    confidence: 0.94,
    severity: 'critical',
  },
  {
    id: 'cs3',
    source: 'Hybrid',
    type: 'Cross-Segment Traffic',
    description: 'IT workstation connecting to OT historian',
    timestamp: '2026-07-06 14:26:08',
    confidence: 0.87,
    severity: 'critical',
  },
  {
    id: 'cs4',
    source: 'IT',
    type: 'DNS Anomaly',
    description: 'DGA domain queries detected from FINANCE segment',
    timestamp: '2026-07-06 14:27:33',
    confidence: 0.91,
    severity: 'high',
  },
  {
    id: 'cs5',
    source: 'OT',
    type: 'Firmware Change',
    description: 'Unauthorized firmware update on SCADA gateway',
    timestamp: '2026-07-06 14:28:11',
    confidence: 0.96,
    severity: 'critical',
  },
];

const weakSignals: WeakSignal[] = [
  {
    id: 'ws1',
    signal: 'Off-hours process execution',
    environment: 'IT',
    observation: 'PowerShell script run at 02:34 AM',
    deviation: 4.2,
    correlatedWith: ['ws3', 'cs1'],
    threatIndicator: true,
  },
  {
    id: 'ws2',
    signal: 'Protocol timing variance',
    environment: 'OT',
    observation: 'Heartbeat interval from PLC shifted +127ms',
    deviation: 2.8,
    correlatedWith: ['cs2'],
    threatIndicator: true,
  },
  {
    id: 'ws3',
    signal: 'Privileged group change',
    environment: 'IT',
    observation: 'User added to Domain Admins',
    deviation: 8.9,
    correlatedWith: ['cs1', 'cs3'],
    threatIndicator: true,
  },
  {
    id: 'ws4',
    signal: 'Network segment crossover',
    environment: 'OT',
    observation: 'Traffic from IT zone to OT zone increased 340%',
    deviation: 4.4,
    correlatedWith: ['cs3', 'cs2'],
    threatIndicator: true,
  },
  {
    id: 'ws5',
    signal: 'File system modification rate',
    environment: 'IT',
    observation: 'Encrypted file extensions appearing',
    deviation: 12.1,
    correlatedWith: ['cs4', 'ws1'],
    threatIndicator: true,
  },
];

const correlationMatrix = [
  { source: 'IT Auth', endpoint: 0.94, lateral: 0.78, exfil: 0.65 },
  { source: 'IT Network', endpoint: 0.82, lateral: 0.91, exfil: 0.73 },
  { source: 'OT Protocol', endpoint: 0.67, lateral: 0.88, exfil: 0.45 },
  { source: 'OT Process', endpoint: 0.71, lateral: 0.92, exfil: 0.38 },
];

const correlationTrend = [
  { time: '14:00', itSignals: 12, otSignals: 8, correlations: 3 },
  { time: '14:10', itSignals: 18, otSignals: 11, correlations: 5 },
  { time: '14:20', itSignals: 24, otSignals: 19, correlations: 9 },
  { time: '14:30', itSignals: 31, otSignals: 24, correlations: 15 },
  { time: '14:40', itSignals: 28, otSignals: 22, correlations: 17 },
];

export default function CorrelationPage() {
  const [selectedSignal, setSelectedSignal] = useState<CorrelationSignal | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-warning text-black';
      default: return 'bg-success text-white';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'IT': return 'border-primary text-primary';
      case 'OT': return 'border-destructive text-destructive';
      default: return 'border-warning text-warning';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Correlation Engine</h1>
          <p className="text-muted-foreground">Weak signal correlation across heterogeneous IT and OT environments</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="gap-1">
            <Activity className="h-3 w-3 animate-pulse" />
            Real-time Correlation
          </Badge>
          <Badge className="bg-destructive text-white gap-1">
            <AlertTriangle className="h-3 w-3" />
            17 Active Correlations
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">IT Signals</p>
                <p className="text-3xl font-bold text-primary">34</p>
              </div>
              <Server className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">OT Signals</p>
                <p className="text-3xl font-bold text-destructive">28</p>
              </div>
              <Cpu className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cross-Environment</p>
                <p className="text-3xl font-bold text-warning">17</p>
              </div>
              <GitBranch className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-success/30 bg-success/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Correlation Score</p>
                <p className="text-3xl font-bold text-success">92%</p>
              </div>
              <Target className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="signals" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="signals">Correlated Signals</TabsTrigger>
          <TabsTrigger value="weak">Weak Signal Analysis</TabsTrigger>
          <TabsTrigger value="matrix">Correlation Matrix</TabsTrigger>
          <TabsTrigger value="timing">Temporal Graph</TabsTrigger>
        </TabsList>

        <TabsContent value="signals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-primary" />
                Correlated Threat Signals
              </CardTitle>
              <CardDescription>
                Real-time correlation between IT and OT environment events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {correlationSignals.map((signal) => (
                <div
                  key={signal.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedSignal?.id === signal.id ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => setSelectedSignal(signal)}
                >
                  <div className={`flex items-center justify-center rounded-full w-10 h-10 ${
                    signal.source === 'IT' ? 'bg-primary/10' :
                    signal.source === 'OT' ? 'bg-destructive/10' : 'bg-warning/10'
                  }`}>
                    {signal.source === 'IT' ? (
                      <Server className="h-5 w-5 text-primary" />
                    ) : signal.source === 'OT' ? (
                      <Cpu className="h-5 w-5 text-destructive" />
                    ) : (
                      <GitBranch className="h-5 w-5 text-warning" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={getSourceColor(signal.source)}>
                        {signal.source}
                      </Badge>
                      <span className="font-medium">{signal.type}</span>
                      <Badge className={getSeverityColor(signal.severity)}>{signal.severity}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{signal.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{signal.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        <span>Confidence: {Math.round(signal.confidence * 100)}%</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </CardContent>
          </Card>

          {selectedSignal && (
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle>Signal Correlation Chain</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                  <div className="space-y-4 pl-10">
                    {[
                      { time: '14:21', event: 'Initial phishing email clicked on FINANCE-WS-12', type: 'initial' },
                      { time: '14:23', event: 'Service account svc_backup authenticated from non-standard source', type: 'auth' },
                      { time: '14:25', event: 'Modbus write command sent to PLC-MAIN-01', type: 'ot' },
                      { time: '14:26', event: 'IT workstation connected to OT historian', type: 'crossover' },
                      { time: '14:27', event: 'DGA DNS queries initiated for C2 beacon', type: 'network' },
                    ].map((step, idx) => (
                      <div key={idx} className="flex items-start gap-4 relative">
                        <div className={`absolute left-[-26px] w-5 h-5 rounded-full flex items-center justify-center text-xs text-white font-bold ${
                          step.type === 'ot' || step.type === 'crossover' ? 'bg-destructive' :
                          step.type === 'auth' ? 'bg-warning' : 'bg-primary'
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 p-3 rounded-lg bg-muted/50 border">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground">{step.time}</span>
                            <Badge variant="outline" className="text-xs">{step.type}</Badge>
                          </div>
                          <p className="text-sm mt-1">{step.event}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="weak" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-primary" />
                Weak Signal Analysis
              </CardTitle>
              <CardDescription>
                Low-confidence indicators that gain significance when correlated
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {weakSignals.map((signal) => (
                <div key={signal.id} className="p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={signal.environment === 'IT' ? 'border-primary text-primary' : 'border-destructive text-destructive'}>
                      {signal.environment}
                    </Badge>
                    <span className="font-medium">{signal.signal}</span>
                    {signal.threatIndicator && (
                      <AlertTriangle className="h-4 w-4 text-destructive ml-auto" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{signal.observation}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1">Deviation Score</p>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${signal.deviation > 5 ? 'bg-destructive' : signal.deviation > 3 ? 'bg-warning' : 'bg-success'}`}
                          style={{ width: `${Math.min(signal.deviation * 10, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Deviation: {signal.deviation}σ
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-xs text-muted-foreground">Correlated with:</span>
                    {signal.correlatedWith.map((id) => (
                      <Badge key={id} variant="secondary" className="text-xs">{id}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matrix" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cross-Environment Correlation Matrix</CardTitle>
              <CardDescription>
                Correlation strength between IT and OT event categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={correlationMatrix} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" domain={[0, 1]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis type="category" dataKey="source" tick={{ fill: 'hsl(var(--muted-foreground))' }} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="endpoint" name="Endpoint" fill="#22c55e" />
                    <Bar dataKey="lateral" name="Lateral Movement" fill="#eab308" />
                    <Bar dataKey="exfil" name="Exfiltration" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Temporal Signal Correlation</CardTitle>
              <CardDescription>
                How IT and OT signals correlate over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={correlationTrend}>
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
                    <Line type="monotone" dataKey="itSignals" stroke="#3b82f6" strokeWidth={2} name="IT Signals" />
                    <Line type="monotone" dataKey="otSignals" stroke="#ef4444" strokeWidth={2} name="OT Signals" />
                    <Line type="monotone" dataKey="correlations" stroke="#22c55e" strokeWidth={3} name="Correlations" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span className="font-medium">Correlation Velocity Increasing</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Cross-environment correlation rate has increased 340% in the last 40 minutes.
                  This indicates a coordinated attack spanning both IT and OT environments.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
