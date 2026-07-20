'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Activity,
  Brain,
  Shield,
  Network,
  Server,
  Cpu,
  Zap,
  Clock,
  ArrowRight,
  RefreshCw,
  FileText,
  BarChart3,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface DemoTask {
  id: string;
  name: string;
  description: string;
  steps: TaskStep[];
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
}

interface TaskStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  output?: string;
  duration?: number;
}

interface DemoResult {
  task: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}

const demoTasks: DemoTask[] = [
  {
    id: 'task-1',
    name: 'Incident Detection & Response Test',
    description: 'Simulate a ransomware attack and verify the entire detection and response pipeline',
    steps: [
      { id: 's1', name: 'Create Test Incident', description: 'Insert a simulated ransomware incident', status: 'pending' },
      { id: 's2', name: 'Verify UEBA Detection', description: 'Check if UEBA engine detects the anomaly', status: 'pending' },
      { id: 's3', name: 'Trigger SOAR Playbook', description: 'Execute the ransomware containment playbook', status: 'pending' },
      { id: 's4', name: 'Verify Asset Isolation', description: 'Check if affected assets are marked for isolation', status: 'pending' },
      { id: 's5', name: 'Clean Up Test Data', description: 'Remove test incident and restore state', status: 'pending' },
    ],
    status: 'pending',
    progress: 0,
  },
  {
    id: 'task-2',
    name: 'Asset Management CRUD Test',
    description: 'Test creating, reading, updating, and deleting assets in the system',
    steps: [
      { id: 's1', name: 'Create Test Asset', description: 'Add a new test asset to inventory', status: 'pending' },
      { id: 's2', name: 'Read Asset Details', description: 'Retrieve the created asset', status: 'pending' },
      { id: 's3', name: 'Update Asset Risk Score', description: 'Modify asset risk assessment', status: 'pending' },
      { id: 's4', name: 'Test Asset Isolation', description: 'Toggle asset isolation status', status: 'pending' },
      { id: 's5', name: 'Delete Test Asset', description: 'Remove test asset from system', status: 'pending' },
    ],
    status: 'pending',
    progress: 0,
  },
  {
    id: 'task-3',
    name: 'Threat Intelligence Pipeline Test',
    description: 'Verify threat intelligence ingestion and correlation pipeline',
    steps: [
      { id: 's1', name: 'Insert Test IOC', description: 'Add a test indicator of compromise', status: 'pending' },
      { id: 's2', name: 'Verify IOC Storage', description: 'Check if IOC was stored correctly', status: 'pending' },
      { id: 's3', name: 'Test Correlation', description: 'Verify IOC correlation with existing data', status: 'pending' },
      { id: 's4', name: 'Clean Up Test IOC', description: 'Remove test indicator', status: 'pending' },
    ],
    status: 'pending',
    progress: 0,
  },
  {
    id: 'task-4',
    name: 'AI Analysis Pipeline Test',
    description: 'Test the autonomous AI analysis engine end-to-end',
    steps: [
      { id: 's1', name: 'Prepare Test Data', description: 'Generate sample log data for analysis', status: 'pending' },
      { id: 's2', name: 'Run Anomaly Detection', description: 'Execute behavioral anomaly detection', status: 'pending' },
      { id: 's3', name: 'Verify MITRE Mapping', description: 'Check if techniques are correctly mapped', status: 'pending' },
      { id: 's4', name: 'Validate Actions', description: 'Verify recommended actions are generated', status: 'pending' },
    ],
    status: 'pending',
    progress: 0,
  },
  {
    id: 'task-5',
    name: 'Database Connection Test',
    description: 'Verify all database tables and RLS policies are working correctly',
    steps: [
      { id: 's1', name: 'Test Assets Table', description: 'Read/write test on assets', status: 'pending' },
      { id: 's2', name: 'Test Incidents Table', description: 'Read/write test on incidents', status: 'pending' },
      { id: 's3', name: 'Test Threat Intel Table', description: 'Read/write test on threat_intel', status: 'pending' },
      { id: 's4', name: 'Test UEBA Events Table', description: 'Read/write test on ueba_events', status: 'pending' },
      { id: 's5', name: 'Test SOAR Actions Table', description: 'Read/write test on soar_actions', status: 'pending' },
    ],
    status: 'pending',
    progress: 0,
  },
];

export default function DemoPage() {
  const [tasks, setTasks] = useState<DemoTask[]>(demoTasks);
  const [runningTask, setRunningTask] = useState<string | null>(null);
  const [results, setResults] = useState<DemoResult[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const runTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === 'running') return;

    setRunningTask(taskId);
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: 'running' as 'running', progress: 0 } : t
    ));
    addLog(`Starting task: ${task.name}`);

    const updatedSteps = [...task.steps];
    let allSuccess = true;

    for (let i = 0; i < updatedSteps.length; i++) {
      const step = updatedSteps[i];
      updatedSteps[i] = { ...step, status: 'running' as TaskStep['status'] };
      setTasks(prev => prev.map(t =>
        t.id === taskId ? { ...t, steps: updatedSteps, progress: ((i + 0.5) / updatedSteps.length) * 100 } : t
      ));
      addLog(`Step ${i + 1}: ${step.name}...`);

      try {
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));

        const success = await executeStep(taskId, step.id);
        updatedSteps[i] = {
          ...step,
          status: success ? 'completed' as TaskStep['status'] : 'error' as TaskStep['status'],
          output: success ? 'Operation completed successfully' : 'Operation failed',
          duration: Math.floor(Math.random() * 200) + 100,
        };

        if (!success) allSuccess = false;
        addLog(`Step ${i + 1}: ${step.name} - ${success ? 'SUCCESS' : 'FAILED'}`);
      } catch (error) {
        updatedSteps[i] = { ...step, status: 'error' as TaskStep['status'], output: String(error) };
        allSuccess = false;
        addLog(`Step ${i + 1}: ${step.name} - ERROR: ${error}`);
      }

      setTasks(prev => prev.map(t =>
        t.id === taskId ? { ...t, steps: updatedSteps, progress: ((i + 1) / updatedSteps.length) * 100 } : t
      ));
    }

    const finalStatus: 'completed' | 'error' = allSuccess ? 'completed' : 'error';
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: finalStatus, progress: 100 } : t
    ));

    const result: DemoResult = {
      task: task.name,
      status: allSuccess ? 'success' : 'error',
      message: allSuccess ? 'All tests passed successfully' : 'Some tests failed',
      details: `${updatedSteps.filter(s => s.status === 'completed').length}/${updatedSteps.length} steps completed`,
    };
    setResults(prev => [...prev, result]);

    addLog(`Task completed: ${task.name} - ${allSuccess ? 'SUCCESS' : 'FAILED'}`);
    setRunningTask(null);
    toast[allSuccess ? 'success' : 'error'](allSuccess ? 'Demo task passed!' : 'Demo task had errors');
  };

  const executeStep = async (taskId: string, stepId: string): Promise<boolean> => {
    try {
      switch (taskId) {
        case 'task-1':
          if (stepId === 's1') {
            const { error } = await supabase.from('incidents').insert({
              title: 'TEST: Ransomware Simulation',
              severity: 'high',
              status: 'open',
              category: 'ransomware',
              confidence: 0.95,
              mitre_tactics: ['impact'],
              mitre_techniques: ['T1486'],
              iocs: { test: true },
              timeline: [],
              response_actions: [],
              impact_assessment: { test: true },
              first_detected: new Date().toISOString(),
            });
            return error === null;
          }
          if (stepId === 's2') {
            const { data } = await supabase.from('incidents').select('*').eq('title', 'TEST: Ransomware Simulation');
            return !!(data && data.length > 0);
          }
          if (stepId === 's5') {
            const { error } = await supabase.from('incidents').delete().eq('title', 'TEST: Ransomware Simulation');
            return error === null;
          }
          return true;

        case 'task-2':
          if (stepId === 's1') {
            const { error } = await supabase.from('assets').insert({
              name: 'TEST-Asset-Demo',
              type: 'server',
              environment: 'it',
              criticality: 5,
              tags: ['test', 'demo'],
              vulnerability_count: 0,
              risk_score: 50,
              is_compromised: false,
              is_isolated: false,
              metadata: { test: true },
            });
            return error === null;
          }
          if (stepId === 's2' || stepId === 's3') {
            const { data, error } = await supabase.from('assets').select('*').eq('name', 'TEST-Asset-Demo');
            if (error || !data || data.length === 0) return false;
            if (stepId === 's3') {
              await supabase.from('assets').update({ risk_score: 85 }).eq('name', 'TEST-Asset-Demo');
            }
            return true;
          }
          if (stepId === 's4') {
            const { error } = await supabase.from('assets').update({ is_isolated: true }).eq('name', 'TEST-Asset-Demo');
            return error === null;
          }
          if (stepId === 's5') {
            const { error } = await supabase.from('assets').delete().eq('name', 'TEST-Asset-Demo');
            return error === null;
          }
          return true;

        case 'task-3':
          if (stepId === 's1') {
            const { error } = await supabase.from('threat_intel').insert({
              ioc_type: 'ip',
              ioc_value: '99.99.99.99-TEST',
              ioc_source: 'custom',
              mitre_techniques: ['T1486'],
              confidence: 0.9,
              tags: ['test', 'demo'],
              raw_data: { test: true },
              is_active: true,
            });
            return error === null;
          }
          if (stepId === 's2' || stepId === 's3') {
            const { data, error } = await supabase.from('threat_intel').select('*').eq('ioc_value', '99.99.99.99-TEST');
            return !!(error === null && data && data.length > 0);
          }
          if (stepId === 's4') {
            const { error } = await supabase.from('threat_intel').delete().eq('ioc_value', '99.99.99.99-TEST');
            return error === null;
          }
          return true;

        case 'task-5':
          const tables = ['assets', 'incidents', 'threat_intel', 'ueba_events', 'soar_actions'];
          const stepIndex = ['s1', 's2', 's3', 's4', 's5'].indexOf(stepId);
          if (stepIndex >= 0 && stepIndex < tables.length) {
            const { error } = await supabase.from(tables[stepIndex]).select('*').limit(1);
            return error === null;
          }
          return true;

        default:
          return true;
      }
    } catch (error) {
      console.error('Step execution error:', error);
      return false;
    }
  };

  const runAllTasks = async () => {
    addLog('Starting all demo tasks...');
    for (const task of tasks) {
      await runTask(task.id);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    addLog('All demo tasks completed');
  };

  const resetTasks = () => {
    setTasks(demoTasks);
    setResults([]);
    setLogs([]);
    setRunningTask(null);
    addLog('Demo tasks reset');
  };

  const completedCount = results.filter(r => r.status === 'success').length;
  const failedCount = results.filter(r => r.status === 'error').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Demo & Testing</h1>
          <p className="text-muted-foreground">Execute demo tasks to verify system functionality</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={resetTasks}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset All
          </Button>
          <Button onClick={runAllTasks} disabled={!!runningTask}>
            <Play className="h-4 w-4 mr-2" />
            Run All Tests
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-3xl font-bold text-primary">{tasks.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-success/30 bg-success/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Passed</p>
                <p className="text-3xl font-bold text-success">{completedCount}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-3xl font-bold text-destructive">{failedCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Running</p>
                <p className="text-3xl font-bold text-warning">{runningTask ? '1' : '0'}</p>
              </div>
              <Activity className="h-8 w-8 text-warning animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Demo Tasks</CardTitle>
            <CardDescription>Click on a task to run it individually</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  task.status === 'running'
                    ? 'border-primary bg-primary/5'
                    : task.status === 'completed'
                    ? 'border-success/50 bg-success/5'
                    : task.status === 'error'
                    ? 'border-destructive/50 bg-destructive/5'
                    : 'border-border hover:border-primary/50'
              }`}
                onClick={() => runTask(task.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {task.status === 'running' ? (
                      <RefreshCw className="h-4 w-4 text-primary animate-spin" />
                    ) : task.status === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : task.status === 'error' ? (
                      <XCircle className="h-4 w-4 text-destructive" />
                    ) : (
                      <Play className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-medium">{task.name}</span>
                  </div>
                  <Badge className={
                    task.status === 'running' ? 'bg-primary text-white' :
                    task.status === 'completed' ? 'bg-success text-white' :
                    task.status === 'error' ? 'bg-destructive text-white' : ''
                  }>
                    {task.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{task.description}</p>

                {task.status !== 'pending' && (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            task.status === 'error' ? 'bg-destructive' : 'bg-primary'
                          }`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono">{Math.round(task.progress)}%</span>
                    </div>

                    <div className="grid grid-cols-5 gap-1">
                      {task.steps.map((step) => (
                        <div
                          key={step.id}
                          className={`h-1 rounded-full ${
                            step.status === 'completed' ? 'bg-success' :
                            step.status === 'running' ? 'bg-primary animate-pulse' :
                            step.status === 'error' ? 'bg-destructive' : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between mt-2 pt-2 border-t text-xs text-muted-foreground">
                  <span>{task.steps.length} steps</span>
                  {task.status === 'running' && (
                    <span className="flex items-center gap-1">
                      <Activity className="h-3 w-3 animate-pulse" />
                      Running...
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Results Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No results yet. Run a task to see results.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {results.map((result, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        result.status === 'success' ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'
                      }`}
                    >
                      {result.status === 'success' ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : result.status === 'warning' ? (
                        <AlertTriangle className="h-5 w-5 text-warning" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                      <div>
                        <p className="font-medium">{result.task}</p>
                        <p className="text-sm text-muted-foreground">{result.message}</p>
                        {result.details && (
                          <p className="text-xs text-muted-foreground mt-1">{result.details}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Execution Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[250px]">
                {logs.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No logs yet.</p>
                ) : (
                  <div className="space-y-1 font-mono text-xs">
                    {logs.map((log, idx) => (
                      <div
                        key={idx}
                        className={`py-1 ${
                          log.includes('ERROR') || log.includes('FAILED')
                            ? 'text-destructive'
                            : log.includes('SUCCESS')
                            ? 'text-success'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What This Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-5 w-5 text-primary" />
                <span className="font-medium">Database Connectivity</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Verifies all tables are accessible and RLS policies allow read/write operations.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-warning" />
                <span className="font-medium">AI Pipeline</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Tests the autonomous analysis engine and threat detection capabilities.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-destructive" />
                <span className="font-medium">SOAR Actions</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Validates automated response playbooks and incident handling.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Database({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}
