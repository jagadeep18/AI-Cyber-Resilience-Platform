'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import {
  Cpu,
  Network,
  Server,
  Shield,
  AlertTriangle,
  Activity,
  Zap,
  Globe,
  Lock,
  Unlock,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  ArrowRight,
  Crosshair,
  Target,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

interface TwinNode {
  id: string;
  name: string;
  type: 'firewall' | 'server' | 'workstation' | 'scada' | 'plc' | 'database';
  status: 'secure' | 'compromised' | 'at_risk';
  connections: string[];
  criticality: number;
}

interface SimulationResult {
  scenario: string;
  breachProbability: number;
  timeToCompromise: number;
  affectedAssets: number;
  containmentSuccess: number;
  businessImpact: string;
}

const twinNodes: TwinNode[] = [
  { id: 'fw1', name: 'Perimeter Firewall', type: 'firewall', status: 'secure', connections: ['dmz', 'core-sw'], criticality: 10 },
  { id: 'dmz', name: 'DMZ Segment', type: 'server', status: 'secure', connections: ['fw1', 'web1', 'mail1'], criticality: 7 },
  { id: 'web1', name: 'Web Server PROD', type: 'server', status: 'at_risk', connections: ['dmz', 'app1'], criticality: 8 },
  { id: 'app1', name: 'Application Server', type: 'server', status: 'secure', connections: ['web1', 'db1'], criticality: 9 },
  { id: 'db1', name: 'Core Database', type: 'database', status: 'secure', connections: ['app1', 'backup1'], criticality: 10 },
  { id: 'plc1', name: 'PLC Controller A', type: 'plc', status: 'secure', connections: ['scada1'], criticality: 10 },
  { id: 'scada1', name: 'SCADA Gateway', type: 'scada', status: 'compromised', connections: ['plc1', 'fw2'], criticality: 10 },
  { id: 'fw2', name: 'OT Firewall', type: 'firewall', status: 'at_risk', connections: ['scada1', 'core-sw'], criticality: 10 },
  { id: 'core-sw', name: 'Core Switch', type: 'server', status: 'secure', connections: ['fw1', 'fw2', 'dc1'], criticality: 9 },
  { id: 'dc1', name: 'Domain Controller', type: 'server', status: 'secure', connections: ['core-sw'], criticality: 10 },
];

const simulationHistory = [
  { time: '00:00', resilience: 87, threats: 12, containment: 94 },
  { time: '04:00', resilience: 89, threats: 8, containment: 95 },
  { time: '08:00', resilience: 82, threats: 18, containment: 91 },
  { time: '12:00', resilience: 78, threats: 24, containment: 88 },
  { time: '16:00', resilience: 85, threats: 15, containment: 93 },
  { time: '20:00', resilience: 91, threats: 10, containment: 96 },
];

const scenarioResults: SimulationResult[] = [
  {
    scenario: 'Ransomware from Phishing',
    breachProbability: 34,
    timeToCompromise: 4.2,
    affectedAssets: 5,
    containmentSuccess: 87,
    businessImpact: 'Partial IT disruption',
  },
  {
    scenario: 'APT Lateral Movement',
    breachProbability: 67,
    timeToCompromise: 12.8,
    affectedAssets: 8,
    containmentSuccess: 62,
    businessImpact: 'IT/OT crossover risk',
  },
  {
    scenario: 'Insider Threat - Privilege Escalation',
    breachProbability: 45,
    timeToCompromise: 2.1,
    affectedAssets: 12,
    containmentSuccess: 78,
    businessImpact: 'Data exposure risk',
  },
  {
    scenario: 'OT Direct Attack via Supply Chain',
    breachProbability: 28,
    timeToCompromise: 6.5,
    affectedAssets: 3,
    containmentSuccess: 91,
    businessImpact: 'Localized OT impact',
  },
];

const resilienceMetrics = [
  { metric: 'Detection', value: 92 },
  { metric: 'Containment', value: 85 },
  { metric: 'Recovery', value: 78 },
  { metric: 'Adaptation', value: 88 },
  { metric: 'Prediction', value: 76 },
];

export default function DigitalTwinPage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [aggressiveness, setAggressiveness] = useState([50]);

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 3000);
  };

  const getNodeColor = (status: string) => {
    switch (status) {
      case 'compromised': return 'fill-destructive';
      case 'at_risk': return 'fill-warning';
      default: return 'fill-success';
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'firewall': return Shield;
      case 'server': return Server;
      case 'database': return Server;
      case 'scada': return Cpu;
      case 'plc': return Cpu;
      default: return Server;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cyber Resilience Digital Twin</h1>
          <p className="text-muted-foreground">Real-time infrastructure simulation and what-if attack modeling</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="gap-1">
            <Activity className={`h-3 w-3 ${isSimulating ? 'animate-pulse' : ''}`} />
            {isSimulating ? 'Simulation Running' : 'Twin Synchronized'}
          </Badge>
          <Button variant="outline" onClick={() => setIsSimulating(!isSimulating)}>
            {isSimulating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isSimulating ? 'Pause' : 'Simulate'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resilience Score</p>
                <p className="text-3xl font-bold text-primary">87%</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Attack Paths</p>
                <p className="text-3xl font-bold text-warning">3</p>
              </div>
              <Network className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compromised Nodes</p>
                <p className="text-3xl font-bold text-destructive">1</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-success/30 bg-success/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Simulations Run</p>
                <p className="text-3xl font-bold text-success">247</p>
              </div>
              <Globe className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="topology" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="topology">Topology View</TabsTrigger>
          <TabsTrigger value="scenarios">Attack Scenarios</TabsTrigger>
          <TabsTrigger value="resilience">Resilience Metrics</TabsTrigger>
          <TabsTrigger value="history">Simulation History</TabsTrigger>
        </TabsList>

        <TabsContent value="topology" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Infrastructure Digital Twin</CardTitle>
              <CardDescription>
                Live topology synchronized with actual infrastructure state
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-[500px] bg-muted/20 rounded-lg border overflow-hidden">
                {/* IT Zone */}
                <div className="absolute top-4 left-4 right-[45%] border-2 border-primary/30 rounded-lg p-4 bg-primary/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">IT Zone</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {twinNodes.filter(n => ['fw1', 'dmz', 'web1', 'app1', 'db1', 'core-sw', 'dc1'].includes(n.id)).map((node) => {
                      const Icon = getNodeIcon(node.type);
                      return (
                        <div
                          key={node.id}
                          className={`p-3 rounded-lg border ${
                            node.status === 'compromised' ? 'bg-destructive/10 border-destructive' :
                            node.status === 'at_risk' ? 'bg-warning/10 border-warning' :
                            'bg-card border-border'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${
                              node.status === 'compromised' ? 'text-destructive' :
                              node.status === 'at_risk' ? 'text-warning' :
                              'text-success'
                            }`} />
                            <span className="text-xs font-medium">{node.name}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            Criticality: {node.criticality}/10
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* OT Zone */}
                <div className="absolute top-4 right-4 left-[55%] border-2 border-destructive/30 rounded-lg p-4 bg-destructive/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Unlock className="h-4 w-4 text-destructive" />
                    <span className="font-medium text-sm">OT Zone</span>
                    <Badge className="bg-destructive text-white text-xs ml-auto">1 Compromised</Badge>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {twinNodes.filter(n => ['fw2', 'scada1', 'plc1'].includes(n.id)).map((node) => {
                      const Icon = getNodeIcon(node.type);
                      return (
                        <div
                          key={node.id}
                          className={`p-3 rounded-lg border ${
                            node.status === 'compromised' ? 'bg-destructive/10 border-destructive animate-pulse' :
                            node.status === 'at_risk' ? 'bg-warning/10 border-warning' :
                            'bg-card border-border'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${
                              node.status === 'compromised' ? 'text-destructive' :
                              node.status === 'at_risk' ? 'text-warning' :
                              'text-success'
                            }`} />
                            <span className="text-xs font-medium">{node.name}</span>
                            {node.status === 'compromised' && (
                              <AlertTriangle className="h-4 w-4 text-destructive ml-auto" />
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            Criticality: {node.criticality}/10
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Connection Lines */}
                <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
                  <div className="flex flex-col items-center gap-2">
                    <ArrowRight className="h-8 w-8 text-warning rotate-[-45deg]" />
                    <span className="text-xs text-warning">IT-OT Bridge</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-success" />
                    <span className="text-xs text-muted-foreground">Secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-warning" />
                    <span className="text-xs text-muted-foreground">At Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
                    <span className="text-xs text-muted-foreground">Compromised</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attack Scenario Simulator</CardTitle>
              <CardDescription>
                Run what-if scenarios to test resilience posture and identify gaps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Attack Aggressiveness</label>
                  <p className="text-xs text-muted-foreground mb-2">Controls attacker sophistication level in simulation</p>
                  <Slider
                    value={aggressiveness}
                    onValueChange={setAggressiveness}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Script Kiddie</span>
                    <span>Nation-State APT</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {scenarioResults.map((result, idx) => (
                  <Card
                    key={idx}
                    className={`cursor-pointer transition-all ${selectedScenario === result.scenario ? 'border-primary bg-primary/5' : ''}`}
                    onClick={() => setSelectedScenario(result.scenario)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="h-5 w-5 text-primary" />
                        <span className="font-medium">{result.scenario}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Breach Probability</p>
                          <p className={`font-bold ${result.breachProbability > 50 ? 'text-destructive' : 'text-success'}`}>
                            {result.breachProbability}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Time to Compromise</p>
                          <p className="font-bold">{result.timeToCompromise}h</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Affected Assets</p>
                          <p className={`font-bold ${result.affectedAssets > 5 ? 'text-warning' : ''}`}>
                            {result.affectedAssets}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Containment Success</p>
                          <p className={`font-bold ${result.containmentSuccess > 80 ? 'text-success' : 'text-warning'}`}>
                            {result.containmentSuccess}%
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">{result.businessImpact}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button className="w-full" onClick={runSimulation} disabled={isSimulating}>
                {isSimulating ? (
                  <>
                    <Activity className="h-4 w-4 mr-2 animate-pulse" />
                    Simulation Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run New Simulation
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resilience" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Resilience Capability Radar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={resilienceMetrics}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Current" dataKey="value" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resilience Improvement Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="font-medium text-sm">OT Segment Isolation</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Increase OT firewall rules to reduce IT-OT crossover probability by 34%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-warning" />
                    <span className="font-medium text-sm">Backup RTO Improvements</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Reduce recovery time objective from 6h to 2h for critical databases
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Crosshair className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Detection Coverage</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Expand UEBA coverage to 95% of privileged accounts
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>24-Hour Resilience Timeline</CardTitle>
              <CardDescription>
                Historical simulation data and threat evolution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={simulationHistory}>
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
                    <Area type="monotone" dataKey="resilience" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} name="Resilience %" />
                    <Area type="monotone" dataKey="containment" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Containment %" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Threat Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={simulationHistory}>
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
                    <Line type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={2} name="Threat Events" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
