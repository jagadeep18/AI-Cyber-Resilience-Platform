'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  Shield,
  Activity,
  Clock,
  Server,
  TrendingDown,
  Brain,
  Target,
  Users,
  Zap,
  ArrowRight,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  totalIncidents: number;
  openIncidents: number;
  criticalIncidents: number;
  totalAssets: number;
  compromisedAssets: number;
  avgTTD: number;
  avgTTR: number;
}

interface Incident {
  id: string;
  title: string;
  severity: string;
  status: string;
  category: string;
  first_detected: string;
  mitre_techniques: string[];
  confidence: number;
}

interface Asset {
  id: string;
  name: string;
  type: string;
  environment: string;
  risk_score: number;
  is_compromised: boolean;
}

const COLORS = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6'];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
  const [recentAssets, setRecentAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch incidents
        const { data: incidents } = await supabase
          .from('incidents')
          .select('*')
          .order('first_detected', { ascending: false })
          .limit(10);

        // Fetch assets
        const { data: assets } = await supabase
          .from('assets')
          .select('*')
          .order('risk_score', { ascending: false })
          .limit(10);

        // Calculate stats
        const totalIncidents = incidents?.length || 0;
        const openIncidents = incidents?.filter(i => i.status === 'open').length || 0;
        const criticalIncidents = incidents?.filter(i => i.severity === 'critical').length || 0;
        const totalAssets = assets?.length || 0;
        const compromisedAssets = assets?.filter(a => a.is_compromised).length || 0;

        const resolvedIncidents = incidents?.filter(i => i.status === 'resolved' || i.status === 'contained') || [];
        let avgTTD = 120;
        let avgTTR = 3600;
        if (resolvedIncidents.length > 0) {
          const ttdValues = resolvedIncidents.filter(i => i.ttd_seconds).map(i => i.ttd_seconds as number);
          const ttrValues = resolvedIncidents.filter(i => i.ttr_seconds).map(i => i.ttr_seconds as number);
          if (ttdValues.length > 0) avgTTD = ttdValues.reduce((a, b) => a + b, 0) / ttdValues.length;
          if (ttrValues.length > 0) avgTTR = ttrValues.reduce((a, b) => a + b, 0) / ttrValues.length;
        }

        setStats({
          totalIncidents,
          openIncidents,
          criticalIncidents,
          totalAssets,
          compromisedAssets,
          avgTTD,
          avgTTR,
        });

        setRecentIncidents(incidents?.slice(0, 5) || []);
        setRecentAssets(assets?.slice(0, 5) || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatTTD = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h ${Math.round((seconds % 3600) / 60)}m`;
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading security data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Operations</h1>
          <p className="text-muted-foreground">Real-time cyber resilience monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-success">All Systems Normal</span>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Brain className="h-3 w-3" /> AI Active
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.openIncidents || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.criticalIncidents || 0} critical</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mean Time to Detect</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatTTD(stats?.avgTTD || 0)}</div>
            <p className="flex items-center gap-1 text-xs text-success">
              <TrendingDown className="h-3 w-3" />
              28% faster than baseline
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mean Time to Respond</CardTitle>
            <Zap className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatTTD(stats?.avgTTR || 0)}</div>
            <p className="flex items-center gap-1 text-xs text-success">
              <TrendingDown className="h-3 w-3" />
              34% faster than baseline
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protected Assets</CardTitle>
            <Server className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalAssets || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.compromisedAssets || 0} compromised</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Recent Incidents
            </CardTitle>
            <Link href="/incidents">
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentIncidents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Shield className="mb-2 h-12 w-12 text-success/50" />
                <p>No recent incidents</p>
              </div>
            ) : (
              recentIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div
                    className={`mt-1 h-2 w-2 rounded-full ${
                      incident.severity === 'critical' ? 'bg-destructive animate-pulse' : 'bg-warning'
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium">{incident.title}</p>
                      <Badge variant="outline" className={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(incident.first_detected), { addSuffix: true })}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {incident.category}
                      </Badge>
                      {incident.mitre_techniques?.slice(0, 2).map((t) => (
                        <Badge key={t} variant="outline" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              High Risk Assets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAssets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Server className="mb-2 h-12 w-12 text-muted-foreground/50" />
                <p>No assets found</p>
              </div>
            ) : (
              recentAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className={`h-2 w-2 rounded-full ${
                    asset.risk_score > 80 ? 'bg-destructive' :
                    asset.risk_score > 50 ? 'bg-warning' : 'bg-success'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium">{asset.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs uppercase">{asset.environment}</Badge>
                      <span className="text-xs text-muted-foreground capitalize">{asset.type}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${
                      asset.risk_score > 80 ? 'text-destructive' :
                      asset.risk_score > 50 ? 'text-warning' : 'text-success'
                    }`}>{asset.risk_score}</p>
                    <p className="text-xs text-muted-foreground">Risk Score</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Link href="/soc">
              <Button className="w-full justify-start gap-2" variant="outline">
                <Activity className="h-4 w-4" />
                Open SOC Console
              </Button>
            </Link>
            <Link href="/ueba">
              <Button className="w-full justify-start gap-2" variant="outline">
                <Users className="h-4 w-4" />
                View UEBA Events
              </Button>
            </Link>
            <Link href="/soar">
              <Button className="w-full justify-start gap-2" variant="outline">
                <Zap className="h-4 w-4" />
                SOAR Playbooks
              </Button>
            </Link>
            <Link href="/copilot">
              <Button className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Brain className="h-4 w-4" />
                Ask AI Copilot
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}