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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  AlertTriangle,
  Clock,
  Target,
  Search,
  Shield,
  User,
  Activity,
  Loader2,
  Play,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
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
  threat_actor?: string;
  ttd_seconds?: number;
  ttr_seconds?: number;
  assigned_to?: string;
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchIncidents();
  }, []);

  async function fetchIncidents() {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('first_detected', { ascending: false });

      if (error) throw error;
      setIncidents(data || []);
    } catch (error) {
      console.error('Error fetching incidents:', error);
      toast.error('Failed to fetch incidents');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(incident: Incident, newStatus: string) {
    setUpdating(true);
    try {
      const updates: Partial<Incident> = { status: newStatus };
      if (newStatus === 'contained' || newStatus === 'resolved') {
        updates.ttr_seconds = Math.floor(
          (Date.now() - new Date(incident.first_detected).getTime()) / 1000
        );
      }

      const { error } = await supabase
        .from('incidents')
        .update(updates)
        .eq('id', incident.id);

      if (error) throw error;
      toast.success(`Incident marked as ${newStatus}`);
      setSelectedIncident(null);
      fetchIncidents();
    } catch (error) {
      toast.error('Failed to update incident');
    } finally {
      setUpdating(false);
    }
  }

  async function triggerPlaybook(incident: Incident) {
    toast.success(`SOAR playbook triggered for "${incident.title}"`);
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-destructive/20 text-destructive';
      case 'investigating': return 'bg-warning/20 text-warning';
      case 'contained': return 'bg-primary/20 text-primary';
      case 'resolved': return 'bg-success/20 text-success';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredIncidents = incidents.filter(incident => {
    if (filter !== 'all' && incident.severity !== filter) return false;
    if (tab === 'open' && incident.status !== 'open' && incident.status !== 'investigating') return false;
    if (search && !incident.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Incidents</h1>
          <p className="text-muted-foreground">Track and manage security incidents</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            {incidents.filter(i => i.status === 'open').length} Open
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Incidents</p>
                <p className="text-2xl font-bold">{incidents.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. TTD</p>
                <p className="text-2xl font-bold">
                  {incidents.filter(i => i.ttd_seconds).length > 0
                    ? `${Math.round(incidents.filter(i => i.ttd_seconds).reduce((a, b) => a + (b.ttd_seconds || 0), 0) / incidents.filter(i => i.ttd_seconds).length)}s`
                    : 'N/A'}
                </p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Confidence</p>
                <p className="text-2xl font-bold">
                  {incidents.length > 0
                    ? `${Math.round(incidents.reduce((a, b) => a + b.confidence, 0) / incidents.length * 100)}%`
                    : 'N/A'}
                </p>
              </div>
              <Target className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Contained</p>
                <p className="text-2xl font-bold text-success">
                  {incidents.filter(i => i.status === 'contained' || i.status === 'resolved').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="all">All Incidents</TabsTrigger>
                <TabsTrigger value="open">Active Only</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search incidents..."
                  className="pl-9 w-[250px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {filteredIncidents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Shield className="mb-2 h-12 w-12 text-success/50" />
                <p>No incidents found</p>
              </div>
            ) : (
              filteredIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="flex items-start gap-4 rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedIncident(incident)}
                >
                  <div className={`mt-1 h-2 w-2 rounded-full ${
                    incident.severity === 'critical' ? 'bg-destructive animate-pulse' :
                    incident.severity === 'high' ? 'bg-warning' : 'bg-muted-foreground'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">{incident.id.substring(0, 8)}</Badge>
                      <Badge variant="outline" className={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                      <Badge className={getStatusColor(incident.status)}>{incident.status}</Badge>
                    </div>
                    <h3 className="font-medium">{incident.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{formatDistanceToNow(new Date(incident.first_detected), { addSuffix: true })}</span>
                      <span className="flex items-center gap-1">
                        <Activity className="h-3 w-3" /> {incident.category}
                      </span>
                      {incident.assigned_to && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" /> {incident.assigned_to}
                        </span>
                      )}
                      <span className="text-primary">{Math.round(incident.confidence * 100)}% confidence</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {incident.mitre_techniques?.slice(0, 3).map(t => (
                        <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                  </div>
                  <Button size="sm" variant="outline">View Details</Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Sheet open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
        <SheetContent className="w-[500px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {selectedIncident?.severity === 'critical' && (
                <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
              )}
              {selectedIncident?.title}
            </SheetTitle>
          </SheetHeader>
          {selectedIncident && (
            <div className="space-y-6 mt-6">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getSeverityColor(selectedIncident.severity)}>
                  {selectedIncident.severity}
                </Badge>
                <Badge className={getStatusColor(selectedIncident.status)}>
                  {selectedIncident.status}
                </Badge>
                <Badge variant="secondary">{selectedIncident.category}</Badge>
              </div>

              {selectedIncident.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-sm">{selectedIncident.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Detected</p>
                  <p className="font-medium">
                    {formatDistanceToNow(new Date(selectedIncident.first_detected), { addSuffix: true })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Confidence</p>
                  <p className="font-medium text-primary">
                    {Math.round(selectedIncident.confidence * 100)}%
                  </p>
                </div>
                {selectedIncident.source_ip && (
                  <div>
                    <p className="text-muted-foreground">Source IP</p>
                    <p className="font-medium font-mono">{selectedIncident.source_ip}</p>
                  </div>
                )}
                {selectedIncident.threat_actor && (
                  <div>
                    <p className="text-muted-foreground">Threat Actor</p>
                    <p className="font-medium">{selectedIncident.threat_actor}</p>
                  </div>
                )}
              </div>

              {selectedIncident.mitre_techniques && selectedIncident.mitre_techniques.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">MITRE ATT&CK</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedIncident.mitre_techniques.map(t => (
                      <Badge key={t} variant="outline">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-2">Actions</p>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() => triggerPlaybook(selectedIncident)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Trigger SOAR
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Update Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {['investigating', 'contained', 'resolved', 'false_positive'].map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={selectedIncident.status === status ? 'default' : 'outline'}
                      onClick={() => updateStatus(selectedIncident, status)}
                      disabled={updating}
                    >
                      {status === 'false_positive' ? 'False Positive' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}