'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Zap,
  Play,
  Pause,
  Clock,
  CheckCircle2,
  XCircle,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface Playbook {
  id: string;
  name: string;
  category: string;
  is_active: boolean;
  is_automated: boolean;
  requires_approval: boolean;
  execution_count: number;
  success_rate: number;
  steps: { action: string; status: string }[];
}

interface ActionHistory {
  id: string;
  playbook_name: string;
  action_type: string;
  target_entity: string;
  status: string;
  executed_by: string;
  created_at: Date;
  confidence: number;
}

const mockPlaybooks: Playbook[] = [
  { id: '1', name: 'Ransomware Response', category: 'ransomware', is_active: true, is_automated: true, requires_approval: false, execution_count: 12, success_rate: 96, steps: [{ action: 'Isolate Endpoint', status: 'success' }, { action: 'Kill Process', status: 'success' }, { action: 'Block IP', status: 'success' }, { action: 'Snapshot VM', status: 'success' }] },
  { id: '2', name: 'Credential Compromise Response', category: 'credential_access', is_active: true, is_automated: true, requires_approval: true, execution_count: 45, success_rate: 98, steps: [{ action: 'Disable Account', status: 'success' }, { action: 'Reset Password', status: 'pending' }, { action: 'Notify User', status: 'pending' }] },
  { id: '3', name: 'Lateral Movement Containment', category: 'lateral_movement', is_active: true, is_automated: false, requires_approval: true, execution_count: 8, success_rate: 87, steps: [{ action: 'Block Port', status: 'pending' }, { action: 'Isolate Segments', status: 'pending' }] },
  { id: '4', name: 'Data Exfiltration Response', category: 'data_exfiltration', is_active: true, is_automated: true, requires_approval: true, execution_count: 23, success_rate: 91, steps: [{ action: 'Block External IP', status: 'success' }, { action: 'Notify User', status: 'success' }, { action: 'Create Ticket', status: 'success' }] },
  { id: '5', name: 'APT Detection Response', category: 'apt', is_active: false, is_automated: false, requires_approval: true, execution_count: 3, success_rate: 67, steps: [{ action: 'Isolate Host', status: 'pending' }, { action: 'Capture Forensics', status: 'pending' }] },
];

const mockActions: ActionHistory[] = [
  { id: 'a1', playbook_name: 'Ransomware Response', action_type: 'isolate_endpoint', target_entity: 'OT-SERVER-03', status: 'success', executed_by: 'SentinelX AI', created_at: new Date(Date.now() - 60000), confidence: 0.92 },
  { id: 'a2', playbook_name: 'Ransomware Response', action_type: 'block_ip', target_entity: '185.234.72.45', status: 'success', executed_by: 'SOAR Agent', created_at: new Date(Date.now() - 120000), confidence: 0.95 },
  { id: 'a3', playbook_name: 'Credential Compromise Response', action_type: 'disable_account', target_entity: 'svc_admin', status: 'running', executed_by: 'SOAR Agent', created_at: new Date(Date.now() - 180000), confidence: 0.89 },
  { id: 'a4', playbook_name: 'Data Exfiltration Response', action_type: 'update_firewall', target_entity: 'EDGE-FW-01', status: 'success', executed_by: 'SentinelX AI', created_at: new Date(Date.now() - 3600000), confidence: 0.88 },
];

export default function SOARPage() {
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ransomware': return 'bg-destructive/20 text-destructive';
      case 'apt': return 'bg-orange-500/20 text-orange-400';
      case 'lateral_movement': return 'bg-warning/20 text-warning';
      case 'credential_access': return 'bg-purple-500/20 text-purple-400';
      case 'data_exfiltration': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'isolate_endpoint': return 'bg-destructive/20 text-destructive';
      case 'block_ip': return 'bg-warning/20 text-warning';
      case 'disable_account': return 'bg-orange-500/20 text-orange-400';
      case 'create_ticket': return 'bg-primary/20 text-primary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'running': return <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />;
      case 'failed': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SOAR Playbooks</h1>
          <p className="text-muted-foreground">Security Orchestration, Automation & Response</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="gap-1">
            <Zap className="h-3 w-3" />
            {mockPlaybooks.filter(p => p.is_active).length} Active Playbooks
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Executions</p>
                <p className="text-2xl font-bold">{mockPlaybooks.reduce((s, p) => s + p.execution_count, 0)}</p>
              </div>
              <Play className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-success">
                  {(mockPlaybooks.reduce((s, p) => s + p.success_rate, 0) / mockPlaybooks.length).toFixed(0)}%
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Automated</p>
                <p className="text-2xl font-bold">{mockPlaybooks.filter(p => p.is_automated).length}</p>
              </div>
              <Zap className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Manual Approval</p>
                <p className="text-2xl font-bold">{mockPlaybooks.filter(p => p.requires_approval).length}</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Playbooks Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="border-b border-border">
              <CardTitle>Active Playbooks</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {mockPlaybooks.filter(p => p.is_active).map((playbook) => (
                  <div
                    key={playbook.id}
                    className={`flex items-start gap-4 rounded-lg border p-4 cursor-pointer hover:bg-muted/30 transition-colors ${selectedPlaybook?.id === playbook.id ? 'border-primary bg-primary/5' : 'border-border'}`}
                    onClick={() => setSelectedPlaybook(playbook)}
                  >
                    <div className={`p-2 rounded ${playbook.is_automated ? 'bg-success/20' : 'bg-warning/20'}`}>
                      {playbook.is_automated ? (
                        <Zap className="h-5 w-5 text-success" />
                      ) : (
                        <Play className="h-5 w-5 text-warning" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{playbook.name}</h4>
                        <Badge variant="outline" className={getCategoryColor(playbook.category)}>
                          {playbook.category.replace('_', ' ')}
                        </Badge>
                        {playbook.is_automated && (
                          <Badge className="bg-success/20 text-success">Auto</Badge>
                        )}
                        {playbook.requires_approval && (
                          <Badge variant="outline">Requires Approval</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {playbook.steps.length} steps | {playbook.execution_count} executions
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-success">{playbook.success_rate}%</div>
                      <div className="text-xs text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Playbook Details */}
        <div>
          <Card className="h-[500px]">
            <CardHeader className="border-b border-border">
              <CardTitle>Playbook Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {!selectedPlaybook ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                  <Zap className="h-12 w-12 opacity-50" />
                  <p className="text-sm mt-2">Select a playbook to view details</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-semibold">{selectedPlaybook.name}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={selectedPlaybook.is_active ? 'bg-success/20 text-success' : ''}>
                        {selectedPlaybook.is_active ? 'Active' : 'Paused'}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Mode:</span>
                      <Badge>{selectedPlaybook.is_automated ? 'Automated' : 'Manual'}</Badge>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="text-sm text-muted-foreground">Execution Steps:</span>
                    <div className="mt-2 space-y-2">
                      {selectedPlaybook.steps.map((step, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                          {getStatusIcon(step.status)}
                          <span className="text-sm">{step.action}</span>
                          <Badge variant="outline" className="ml-auto">{step.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="w-full"><Play className="h-4 w-4 mr-1" /> Run</Button>
                    <Button size="sm" variant="outline" className="w-full">
                      {selectedPlaybook.is_active ? <Pause className="h-4 w-4 mr-1" /> : null}
                      {selectedPlaybook.is_active ? 'Pause' : 'Activate'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Actions */}
      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle>Recent Response Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            {mockActions.map((action) => (
              <div key={action.id} className="flex items-center gap-4 p-3 rounded border border-border hover:bg-muted/30">
                {getStatusIcon(action.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getActionColor(action.action_type)}>
                      {action.action_type.replace('_', ' ')}
                    </Badge>
                    <code className="text-sm">{action.target_entity}</code>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(action.created_at, { addSuffix: true })} | {action.playbook_name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{action.executed_by}</p>
                  <p className="text-xs text-primary">{Math.round(action.confidence * 100)}% conf</p>
                </div>
                <Button size="sm" variant="ghost">Rollback</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}