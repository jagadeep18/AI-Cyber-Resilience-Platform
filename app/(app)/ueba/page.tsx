'use client';

import { useState } from 'react';
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
  Users,
  Activity,
  AlertTriangle,
  Brain,
  TrendingUp,
  Shield,
  UserCheck,
  UserX,
  Search,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { formatDistanceToNow } from 'date-fns';

interface UEBAEvent {
  id: string;
  user_name: string;
  anomaly_type: string;
  deviation_score: number;
  algorithm: string;
  detected_at: Date;
  is_confirmed: boolean;
  details: string;
  entity_type: string;
  baseline_value: number;
  observed_value: number;
}

const mockUEBAEvents: UEBAEvent[] = [
  { id: '1', user_name: 'admin_jones', anomaly_type: 'login_anomaly', deviation_score: 8.5, algorithm: 'isolation_forest', detected_at: new Date(Date.now() - 300000), is_confirmed: false, details: 'Login at 3:42 AM outside normal hours (baseline: 9am-6pm)', entity_type: 'user', baseline_value: 6, observed_value: 42 },
  { id: '2', user_name: 'sarah_m', anomaly_type: 'data_access_anomaly', deviation_score: 7.2, algorithm: 'autoencoder', detected_at: new Date(Date.now() - 600000), is_confirmed: false, details: 'Accessed 47 confidential files in 5 minutes', entity_type: 'user', baseline_value: 5, observed_value: 47 },
  { id: '3', user_name: 'john_doe', anomaly_type: 'privilege_escalation', deviation_score: 9.1, algorithm: 'ensemble', detected_at: new Date(Date.now() - 1800000), is_confirmed: true, details: 'Svc_backup added to Domain Admins group', entity_type: 'user', baseline_value: 0, observed_value: 1 },
  { id: '4', user_name: 'finance_team', anomaly_type: 'data_exfiltration', deviation_score: 6.8, algorithm: 'lstm', detected_at: new Date(Date.now() - 3600000), is_confirmed: false, details: 'Large outbound data transfer to personal cloud', entity_type: 'network', baseline_value: 50, observed_value: 850 },
  { id: '5', user_name: 'dev_server_02', anomaly_type: 'process_anomaly', deviation_score: 7.9, algorithm: 'dbscan', detected_at: new Date(Date.now() - 5400000), is_confirmed: false, details: 'Unexpected PowerShell script execution', entity_type: 'device', baseline_value: 0, observed_value: 1 },
  { id: '6', user_name: 'ext_contractor_01', anomaly_type: 'lateral_movement', deviation_score: 8.3, algorithm: 'ensemble', detected_at: new Date(Date.now() - 7200000), is_confirmed: false, details: 'RDP connection to multiple critical servers', entity_type: 'user', baseline_value: 2, observed_value: 12 },
];

const radarData = [
  { anomaly: 'Login', score: 65, fullMark: 100 },
  { anomaly: 'Data Access', score: 82, fullMark: 100 },
  { anomaly: 'Network', score: 45, fullMark: 100 },
  { anomaly: 'Process', score: 58, fullMark: 100 },
  { anomaly: 'Privilege', score: 91, fullMark: 100 },
  { anomaly: 'Exfiltration', score: 32, fullMark: 100 },
];

export default function UEBAPage() {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const getAnomalyColor = (type: string) => {
    switch (type) {
      case 'login_anomaly': return 'bg-primary/20 text-primary';
      case 'data_access_anomaly': return 'bg-warning/20 text-warning';
      case 'privilege_escalation': return 'bg-destructive/20 text-destructive';
      case 'data_exfiltration': return 'bg-destructive/20 text-destructive';
      case 'lateral_movement': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredEvents = mockUEBAEvents.filter(event => {
    if (filter !== 'all' && event.anomaly_type !== filter) return false;
    if (search && !event.user_name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const averageScore = mockUEBAEvents.reduce((sum, e) => sum + e.deviation_score, 0) / mockUEBAEvents.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">UEBA Dashboard</h1>
          <p className="text-muted-foreground">User & Entity Behaviour Analytics with AI-driven anomaly detection</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="gap-1">
            <Brain className="h-3 w-3" />
            7 ML Models Active
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Anomalies</p>
                <p className="text-2xl font-bold">{mockUEBAEvents.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Deviation Score</p>
                <p className="text-2xl font-bold">{averageScore.toFixed(1)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confirmed Threats</p>
                <p className="text-2xl font-bold text-destructive">{mockUEBAEvents.filter(e => e.is_confirmed).length}</p>
              </div>
              <Shield className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Users Monitored</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Anomaly Radar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Behavioural Risk Radar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="anomaly" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <PolarRadiusAxis tick={{ fill: '#94a3b8' }} />
                  <Radar name="Risk" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Algorithm Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Detection Algorithm Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { algo: 'Isolation Forest', detections: 12, fp: 2 },
                    { algo: 'Autoencoder', detections: 8, fp: 1 },
                    { algo: 'LOF', detections: 6, fp: 1 },
                    { algo: 'Ensemble', detections: 15, fp: 0 },
                    { algo: 'LSTM', detections: 9, fp: 1 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="algo" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#94a3b8' }} />
                  <Tooltip />
                  <Bar dataKey="detections" fill="#3b82f6" name="Detections" />
                  <Bar dataKey="fp" fill="#ef4444" name="False Positives" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle>Detected Anomalies</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-9 w-[200px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Anomaly Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="login_anomaly">Login Anomaly</SelectItem>
                  <SelectItem value="data_access_anomaly">Data Access</SelectItem>
                  <SelectItem value="privilege_escalation">Privilege Escalation</SelectItem>
                  <SelectItem value="data_exfiltration">Data Exfiltration</SelectItem>
                  <SelectItem value="lateral_movement">Lateral Movement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className={`flex items-start gap-4 rounded-lg border p-4 ${event.is_confirmed ? 'border-destructive/50 bg-destructive/5' : 'border-border'} hover:bg-muted/30 transition-colors`}
              >
                <div className={`mt-1 p-2 rounded ${event.is_confirmed ? 'bg-destructive/20' : 'bg-warning/20'}`}>
                  {event.is_confirmed ? <UserX className="h-5 w-5 text-destructive" /> : <Activity className="h-5 w-5 text-warning" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{event.user_name}</p>
                    <Badge className={getAnomalyColor(event.anomaly_type).replace('bg-', 'bg-primary/10 text-primary')}>
                      {event.anomaly_type.replace('_', ' ')}
                    </Badge>
                    {event.is_confirmed && (
                      <Badge variant="destructive">Confirmed Threat</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{event.details}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <span>Algorithm: <code className="text-primary">{event.algorithm}</code></span>
                    <span>Baseline: {event.baseline_value} | Observed: {event.observed_value}</span>
                    <span>{formatDistanceToNow(event.detected_at, { addSuffix: true })}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-destructive">{event.deviation_score.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">Deviation Score</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <UserCheck className="h-4 w-4 mr-1" />
                    Confirm
                  </Button>
                  <Button size="sm" variant="ghost">
                    Dismiss
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}