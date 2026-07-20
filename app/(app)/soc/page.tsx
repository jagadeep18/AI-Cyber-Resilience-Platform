'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertTriangle,
  Radio,
  Clock,
  Shield,
  Activity,
  User,
  Zap,
  Eye,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Incident {
  id: string;
  title: string;
  severity: string;
  status: string;
  category: string;
  source_ip?: string;
  mitre_techniques: string[];
  confidence: number;
  first_detected: string;
  description?: string;
}

interface SOARAction {
  id: string;
  action_type: string;
  target_entity: string;
  status: string;
  executed_by: string;
  created_at: string;
}

export default function SOCConsolePage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [soarActions, setSoarActions] = useState<SOARAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    try {
      const [incidentsRes, actionsRes] = await Promise.all([
        supabase
          .from('incidents')
          .select('*')
          .order('first_detected', { ascending: false })
          .limit(20),
        supabase
          .from('soar_actions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10),
      ]);

      if (incidentsRes.data) setIncidents(incidentsRes.data);
      if (actionsRes.data) setSoarActions(actionsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function acknowledgeIncident(incident: Incident) {
    try {
      const { error } = await supabase
        .from('incidents')
        .update({ status: 'investigating' })
        .eq('id', incident.id);

      if (error) throw error;
      toast.success('Incident acknowledged');
      fetchData();
    } catch (error) {
      toast.error('Failed to acknowledge');
    }
  }

  async function triggerSOAR(incident: Incident) {
    const playbookActions = [
      { action_type: 'isolate_endpoint', target_entity: incident.source_ip || 'Unknown', status: 'pending', executed_by: 'SOC Analyst' },
      { action_type: 'block_ip', target_entity: incident.source_ip || 'Unknown', status: 'pending', executed_by: 'SOC Analyst' },
    ];

    try {
      const { error } = await supabase
        .from('soar_actions')
        .insert(playbookActions.map(a => ({
          ...a,
          incident_id: incident.id,
          confidence: incident.confidence,
        })));

      if (error) throw error;
      toast.success('SOAR playbook triggered');
      fetchData();
    } catch (error) {
      toast.error('Failed to trigger SOAR');
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ransomware': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'lateral_movement': return <Activity className="h-4 w-4 text-warning" />;
      case 'data_exfiltration': return <Shield className="h-4 w-4 text-primary" />;
      case 'phishing': return <User className="h-4 w-4 text-warning" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const filteredIncidents = filter === 'all'
    ? incidents
    : filter === 'acknowledged'
    ? incidents.filter(i => i.status !== 'open')
    : incidents.filter(i => i.severity === filter);

  const stats = {
    total: incidents.length,
    critical: incidents.filter(i => i.severity === 'critical').length,
    investigating: incidents.filter(i => i.status === 'investigating').length,
    avgTime: 42
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading SOC data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SOC Console</h1>
          <p className="text-muted-foreground">Real-time security monitoring and response</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2">
            <div className="relative">
              <Radio className="h-5 w-5 text-primary" />
              <div className="absolute -inset-1 animate-ping rounded-full bg-primary/30" />
            </div>
            <span className="text-sm font-medium">Live Mode</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className={cn(stats.critical > 0 && "glow-critical")}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical</p>
                <p className="text-3xl font-bold text-destructive">{stats.critical}</p>
              </div>
              {stats.critical > 0 && (
                <div className="relative">
                  <div className="absolute -inset-2 animate-ping rounded-full bg-destructive/30" />
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Investigating</p>
                <p className="text-3xl font-bold text-success">{stats.investigating}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Time to Ack</p>
                <p className="text-3xl font-bold">{stats.avgTime}s</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter alerts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Alerts</SelectItem>
                <SelectItem value="critical">Critical Only</SelectItem>
                <SelectItem value="high">High Only</SelectItem>
                <SelectItem value="medium">Medium Only</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Search alerts..." className="flex-1" />
          </div>

          <Card className="h-[600px] overflow-hidden">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary animate-pulse" />
                Alert Stream
                <Badge variant="secondary" className="ml-2">{filteredIncidents.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[520px] overflow-auto p-0">
              {filteredIncidents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Shield className="h-12 w-12 mb-2" />
                  <p>No alerts to display</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredIncidents.map((incident) => (
                    <div
                      key={incident.id}
                      className={cn(
                        "p-4 hover:bg-muted/50 cursor-pointer transition-colors",
                        selectedIncident?.id === incident.id && "bg-muted/50",
                        incident.status === 'open' && incident.severity === 'critical' && "animate-pulse bg-destructive/5"
                      )}
                      onClick={() => setSelectedIncident(incident)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "mt-1 p-1 rounded",
                          incident.severity === 'critical' ? "text-destructive" :
                          incident.severity === 'high' ? "text-orange-400" : "text-muted-foreground"
                        )}>
                          {getCategoryIcon(incident.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={cn(
                              "font-medium truncate",
                              incident.status !== 'open' && "text-muted-foreground line-through"
                            )}>
                              {incident.title}
                            </p>
                            <Badge variant="outline" className={getSeverityColor(incident.severity)}>
                              {incident.severity}
                            </Badge>
                            {incident.status !== 'open' && (
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {incident.description || incident.category}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{formatDistanceToNow(new Date(incident.first_detected), { addSuffix: true })}</span>
                            <span>CID: {incident.id.substring(0, 8)}</span>
                            <span className="text-primary">
                              {Math.round(incident.confidence * 100)}% confidence
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="h-[600px]">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Alert Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {!selectedIncident ? (
                <div className="flex flex-col items-center justify-center h-[480px] text-muted-foreground">
                  <Eye className="h-12 w-12 mb-2 opacity-50" />
                  <p className="text-sm">Select an alert to view details</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={getSeverityColor(selectedIncident.severity)}>
                        {selectedIncident.severity}
                      </Badge>
                      <Badge variant="secondary">{selectedIncident.category}</Badge>
                    </div>
                    <h3 className="font-semibold">{selectedIncident.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedIncident.description || 'No additional description available.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Time</span>
                      <span>{formatDistanceToNow(new Date(selectedIncident.first_detected), { addSuffix: true })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="text-primary">{Math.round(selectedIncident.confidence * 100)}%</span>
                    </div>
                    {selectedIncident.source_ip && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Source IP</span>
                        <code className="text-xs">{selectedIncident.source_ip}</code>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="outline">{selectedIncident.status}</Badge>
                    </div>
                  </div>

                  {selectedIncident.mitre_techniques && selectedIncident.mitre_techniques.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">MITRE ATT&CK</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedIncident.mitre_techniques.map(t => (
                          <Badge key={t} variant="outline">{t}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 space-y-2">
                    {selectedIncident.status === 'open' && (
                      <>
                        <Button className="w-full" onClick={() => acknowledgeIncident(selectedIncident)}>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Acknowledge Alert
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => triggerSOAR(selectedIncident)}>
                          <Zap className="h-4 w-4 mr-2" />
                          Trigger SOAR Playbook
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-border py-3">
              <CardTitle className="text-sm">Recent SOAR Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-2 max-h-[200px] overflow-auto">
              {soarActions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent actions</p>
              ) : (
                soarActions.slice(0, 5).map((action) => (
                  <div key={action.id} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                    <Zap className="h-4 w-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm">{action.action_type.replace('_', ' ')}</p>
                      <p className="text-xs text-muted-foreground">{action.target_entity}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{action.status}</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}