'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bot,
  Activity,
  Shield,
  Brain,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Cpu,
  Zap,
  Database,
  Network,
  TrendingUp,
  Play,
  Pause,
  RotateCcw,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AIAgent {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'paused' | 'idle' | 'error';
  lastRun: string;
  nextRun?: string;
  runsToday: number;
  successRate: number;
  type: 'detection' | 'analysis' | 'response' | 'monitoring';
  icon: React.ElementType;
  metrics: {
    processed: number;
    detected: number;
    actions: number;
  };
}

const initialAgents: AIAgent[] = [
  {
    id: 'agent-ueba',
    name: 'UEBA Anomaly Detector',
    description: 'Monitors user and entity behavior for anomalous patterns using ensemble ML models',
    status: 'running',
    lastRun: '2 seconds ago',
    nextRun: 'In 58 seconds',
    runsToday: 2880,
    successRate: 98.2,
    type: 'detection',
    icon: Brain,
    metrics: { processed: 15420, detected: 34, actions: 12 },
  },
  {
    id: 'agent-threat-intel',
    name: 'Threat Intelligence Aggregator',
    description: 'Aggregates and correlates threat intelligence from 5 external sources',
    status: 'running',
    lastRun: '5 minutes ago',
    nextRun: 'In 25 minutes',
    runsToday: 288,
    successRate: 99.1,
    type: 'monitoring',
    icon: Database,
    metrics: { processed: 847, detected: 23, actions: 0 },
  },
  {
    id: 'agent-attack-graph',
    name: 'Attack Path Analyzer',
    description: 'Continuously maps potential attack paths through the infrastructure',
    status: 'running',
    lastRun: '10 minutes ago',
    nextRun: 'In 50 minutes',
    runsToday: 144,
    successRate: 97.8,
    type: 'analysis',
    icon: Network,
    metrics: { processed: 234, detected: 7, actions: 3 },
  },
  {
    id: 'agent-mitre-mapper',
    name: 'MITRE ATT&CK Mapper',
    description: 'Maps detected techniques to MITRE framework and predicts next stages',
    status: 'running',
    lastRun: '1 minute ago',
    nextRun: 'In 59 minutes',
    runsToday: 1440,
    successRate: 96.5,
    type: 'analysis',
    icon: Search,
    metrics: { processed: 892, detected: 45, actions: 0 },
  },
  {
    id: 'agent-soar',
    name: 'SOAR Orchestrator',
    description: 'Autonomous incident response with playbook execution and approval workflows',
    status: 'running',
    lastRun: '30 seconds ago',
    nextRun: 'Continuous',
    runsToday: 8640,
    successRate: 94.7,
    type: 'response',
    icon: Zap,
    metrics: { processed: 156, detected: 0, actions: 42 },
  },
  {
    id: 'agent-vulnerability',
    name: 'Vulnerability Scanner',
    description: 'Scans for CVEs and prioritizes based on asset criticality and threat intelligence',
    status: 'paused',
    lastRun: '2 hours ago',
    runsToday: 24,
    successRate: 99.5,
    type: 'detection',
    icon: Shield,
    metrics: { processed: 890, detected: 12, actions: 0 },
  },
  {
    id: 'agent-ransomware',
    name: 'Ransomware Detection Agent',
    description: 'RealTime monitoring for encryption patterns and ransomware indicators',
    status: 'running',
    lastRun: '1 second ago',
    nextRun: 'Continuous',
    runsToday: 86400,
    successRate: 99.8,
    type: 'detection',
    icon: AlertTriangle,
    metrics: { processed: 45000, detected: 2, actions: 1 },
  },
  {
    id: 'agent-correlation',
    name: 'IT/OT Correlation Engine',
    description: 'Correlates weak signals across IT and OT environments for cross-domain threats',
    status: 'running',
    lastRun: '15 minutes ago',
    nextRun: 'In 45 minutes',
    runsToday: 96,
    successRate: 95.2,
    type: 'analysis',
    icon: TrendingUp,
    metrics: { processed: 1200, detected: 8, actions: 2 },
  },
];

const recentActions = [
  { id: '1', agent: 'Ransomware Detection Agent', action: 'Isolated suspicious process on OT-SERVER-03', time: '2 min ago', status: 'success' },
  { id: '2', agent: 'UEBA Anomaly Detector', action: 'Flagged credential harvesting pattern for user svc_backup', time: '5 min ago', status: 'warning' },
  { id: '3', agent: 'SOAR Orchestrator', action: 'Executed containment playbook: Block C2 IP 185.234.72.45', time: '8 min ago', status: 'success' },
  { id: '4', agent: 'MITRE ATT&CK Mapper', action: 'Updated attack chain with lateral movement stage', time: '12 min ago', status: 'success' },
  { id: '5', agent: 'Threat Intelligence Aggregator', action: 'Added 23 new IOCs from CISA advisory', time: '20 min ago', status: 'success' },
  { id: '6', agent: 'Attack Path Analyzer', action: 'Identified new critical path to SCADA gateway', time: '25 min ago', status: 'warning' },
];

export default function AgentsPage() {
  const [agents, setAgents] = useState<AIAgent[]>(initialAgents);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [metrics, setMetrics] = useState({ totalRuns: 0, activeAgents: 0, detections: 0, actions: 0 });

  useEffect(() => {
    const total = agents.reduce((sum, a) => sum + a.runsToday, 0);
    const active = agents.filter(a => a.status === 'running').length;
    const detections = agents.reduce((sum, a) => sum + a.metrics.detected, 0);
    const actions = agents.reduce((sum, a) => sum + a.metrics.actions, 0);

    setMetrics({ totalRuns: total, activeAgents: active, detections, actions });
  }, [agents]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-success text-white';
      case 'paused': return 'bg-warning text-black';
      case 'error': return 'bg-destructive text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'detection': return 'border-primary text-primary';
      case 'analysis': return 'border-warning text-warning';
      case 'response': return 'border-destructive text-destructive';
      case 'monitoring': return 'border-success text-success';
      default: return 'border-muted text-muted-foreground';
    }
  };

  const handleAgentAction = (agent: AIAgent, action: 'start' | 'pause' | 'restart') => {
    setAgents(prevAgents =>
      prevAgents.map(a => {
        if (a.id === agent.id) {
          let newStatus: 'running' | 'paused' | 'idle' | 'error' = a.status;
          if (action === 'start') {
            newStatus = 'running';
          } else if (action === 'pause') {
            newStatus = 'paused';
          } else if (action === 'restart') {
            newStatus = 'running';
          }
          return { ...a, status: newStatus };
        }
        return a;
      })
    );

    if (selectedAgent?.id === agent.id) {
      setSelectedAgent(prev => prev ? { ...prev, status: action === 'pause' ? 'paused' : 'running' } : null);
    }

    toast.success(`${agent.name}: ${action === 'start' ? 'Started' : action === 'pause' ? 'Paused' : 'Restarted'} successfully`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Agents</h1>
          <p className="text-muted-foreground">Autonomous AI agents running security operations</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="gap-1">
            <Bot className="h-3 w-3" />
            {metrics.activeAgents} Active
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Agents</p>
                <p className="text-3xl font-bold text-primary">{metrics.activeAgents}</p>
              </div>
              <Bot className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-success/30 bg-success/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Runs Today</p>
                <p className="text-3xl font-bold text-success">{metrics.totalRuns.toLocaleString()}</p>
              </div>
              <Activity className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Detections</p>
                <p className="text-3xl font-bold text-warning">{metrics.detections}</p>
              </div>
              <Search className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Auto Actions</p>
                <p className="text-3xl font-bold text-destructive">{metrics.actions}</p>
              </div>
              <Zap className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="agents" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="agents">Running Agents</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => {
              const Icon = agent.icon;
              return (
                <Card
                  key={agent.id}
                  className={`cursor-pointer transition-all hover:border-primary/50 ${
                    selectedAgent?.id === agent.id ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg relative ${
                        agent.status === 'running' ? 'bg-success/20' :
                        agent.status === 'paused' ? 'bg-warning/20' : 'bg-muted'
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          agent.status === 'running' ? 'text-success' :
                          agent.status === 'paused' ? 'text-warning' : 'text-muted-foreground'
                        }`} />
                        {agent.status === 'running' && (
                          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-success animate-pulse" />
                        )}
                      </div>
                      <Badge className={`${getStatusColor(agent.status)} flex items-center gap-1.5`}>
                        {agent.status === 'running' && (
                          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                        )}
                        {agent.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-base mt-2">{agent.name}</CardTitle>
                    <CardDescription className="text-xs">{agent.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="p-2 rounded bg-muted/50 text-center">
                        <p className="text-muted-foreground">Processed</p>
                        <p className="font-bold">{agent.metrics.processed}</p>
                      </div>
                      <div className="p-2 rounded bg-warning/10 text-center">
                        <p className="text-muted-foreground">Detected</p>
                        <p className="font-bold text-warning">{agent.metrics.detected}</p>
                      </div>
                      <div className="p-2 rounded bg-destructive/10 text-center">
                        <p className="text-muted-foreground">Actions</p>
                        <p className="font-bold text-destructive">{agent.metrics.actions}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Last: {agent.lastRun}</span>
                      <Badge variant="outline" className={getTypeColor(agent.type)}>{agent.type}</Badge>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1"
                        onClick={(e) => { e.stopPropagation(); handleAgentAction(agent, agent.status === 'running' ? 'pause' : 'start'); }}
                      >
                        {agent.status === 'running' ? <Pause className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                        {agent.status === 'running' ? 'Pause' : 'Start'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1"
                        onClick={(e) => { e.stopPropagation(); handleAgentAction(agent, 'restart'); }}
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Restart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {selectedAgent && (
            <Card className="border-primary/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <selectedAgent.icon className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle>{selectedAgent.name}</CardTitle>
                      <CardDescription>{selectedAgent.description}</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedAgent(null)}>Close</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Performance Metrics</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Success Rate</span>
                        <span className="font-bold text-success">{selectedAgent.successRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Runs Today</span>
                        <span className="font-bold">{selectedAgent.runsToday.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Run</span>
                        <span>{selectedAgent.lastRun}</span>
                      </div>
                      {selectedAgent.nextRun && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Next Run</span>
                          <span>{selectedAgent.nextRun}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Today's Activity</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-3 rounded bg-muted/50 text-center">
                        <p className="text-2xl font-bold">{selectedAgent.metrics.processed}</p>
                        <p className="text-xs text-muted-foreground">Processed</p>
                      </div>
                      <div className="p-3 rounded bg-warning/10 text-center">
                        <p className="text-2xl font-bold text-warning">{selectedAgent.metrics.detected}</p>
                        <p className="text-xs text-muted-foreground">Detected</p>
                      </div>
                      <div className="p-3 rounded bg-destructive/10 text-center">
                        <p className="text-2xl font-bold text-destructive">{selectedAgent.metrics.actions}</p>
                        <p className="text-xs text-muted-foreground">Actions</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Controls</h4>
                    <div className="space-y-2">
                      <Button
                        className="w-full"
                        size="sm"
                        variant={selectedAgent.status === 'running' ? 'destructive' : 'default'}
                        onClick={() => handleAgentAction(selectedAgent, selectedAgent.status === 'running' ? 'pause' : 'start')}
                      >
                        {selectedAgent.status === 'running' ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                        {selectedAgent.status === 'running' ? 'Pause Agent' : 'Start Agent'}
                      </Button>
                      <Button className="w-full" size="sm" variant="outline" onClick={() => handleAgentAction(selectedAgent, 'restart')}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Restart Agent
                      </Button>
                      <Button className="w-full" size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Agent Actions</CardTitle>
              <CardDescription>Latest actions taken by autonomous agents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActions.map((action) => (
                  <div key={action.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className={`p-2 rounded ${
                      action.status === 'success' ? 'bg-success/20' : 'bg-warning/20'
                    }`}>
                      {action.status === 'success' ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-warning" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{action.agent}</p>
                        <span className="text-xs text-muted-foreground">{action.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{action.action}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Agent Uptime</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {agents.map((agent) => (
                  <div key={agent.id} className="flex items-center gap-3">
                    <agent.icon className="h-4 w-4 text-primary" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{agent.name}</span>
                        <span className="font-bold">{agent.successRate}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full ${agent.successRate > 95 ? 'bg-success' : agent.successRate > 90 ? 'bg-warning' : 'bg-destructive'}`}
                          style={{ width: `${agent.successRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agent Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['detection', 'analysis', 'response', 'monitoring'].map((type) => {
                    const count = agents.filter(a => a.type === type).length;
                    const percentage = (count / agents.length) * 100;
                    return (
                      <div key={type} className="flex items-center gap-3">
                        <Badge variant="outline" className={getTypeColor(type)}>{type}</Badge>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              type === 'detection' ? 'bg-primary' :
                              type === 'analysis' ? 'bg-warning' :
                              type === 'response' ? 'bg-destructive' : 'bg-success'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
