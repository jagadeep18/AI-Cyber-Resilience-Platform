'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Target,
  BarChart3,
  Users,
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

const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6'];

const complianceData = [
  { date: 'Jan', score: 78 },
  { date: 'Feb', score: 82 },
  { date: 'Mar', score: 85 },
  { date: 'Apr', score: 88 },
  { date: 'May', score: 91 },
  { date: 'Jun', score: 94 },
];

const incidentDistribution = [
  { name: 'Prevented', value: 145 },
  { name: 'Contained', value: 23 },
  { name: 'Active', value: 8 },
];

const kpiData = [
  { label: 'SLA Compliance', value: 96, indicator: 'green' },
  { label: 'Incident Response', value: 94, indicator: 'green' },
  { label: 'System Uptime', value: 99.7, indicator: 'green' },
  { label: 'Patch Compliance', value: 88, indicator: 'yellow' },
];

export default function ExecutiveDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-muted-foreground">High-level security posture and business metrics</p>
        </div>
        <Badge className="bg-success/20 text-success">Q2 2024 Report</Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-5">
        <Card className="card-hover border-l-4 border-l-success">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Security Score</p>
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <p className="text-4xl font-bold text-success">A</p>
            <p className="text-sm text-success">+12% from Q1</p>
          </CardContent>
        </Card>

        <Card className="card-hover border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Incidents Blocked</p>
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <p className="text-4xl font-bold">145</p>
            <p className="text-sm text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>

        <Card className="card-hover border-l-4 border-l-warning">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Active Threats</p>
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <p className="text-4xl font-bold text-warning">8</p>
            <p className="text-sm text-muted-foreground">Under investigation</p>
          </CardContent>
        </Card>

        <Card className="card-hover border-l-4 border-l-success">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">MTTD</p>
              <Clock className="h-5 w-5 text-success" />
            </div>
            <p className="text-4xl font-bold">21m</p>
            <div className="flex items-center gap-1">
              <TrendingDown className="h-4 w-4 text-success" />
              <p className="text-sm text-success">-28% improvement</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border-l-4 border-l-success">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">MTTR</p>
              <Target className="h-5 w-5 text-success" />
            </div>
            <p className="text-4xl font-bold">1.2h</p>
            <div className="flex items-center gap-1">
              <TrendingDown className="h-4 w-4 text-success" />
              <p className="text-sm text-success">-34% faster</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Compliance Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Compliance Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={complianceData}>
                  <defs>
                    <linearGradient id="complianceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" tick={{ fill: '#94a3b8' }} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#22c55e"
                    strokeWidth={2}
                    fill="url(#complianceGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Incident Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Incident Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incidentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {incidentDistribution.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                {incidentDistribution.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span className="text-sm">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPIs */}
      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle>Key Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-4">
            {kpiData.map((kpi) => (
              <div key={kpi.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{kpi.label}</span>
                  <span className={`text-sm font-medium ${
                    kpi.indicator === 'green' ? 'text-success' :
                    kpi.indicator === 'yellow' ? 'text-warning' : 'text-destructive'
                  }`}>
                    {kpi.value}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      kpi.indicator === 'green' ? 'bg-success' :
                      kpi.indicator === 'yellow' ? 'bg-warning' : 'bg-destructive'
                    }`}
                    style={{ width: `${kpi.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Executive Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-success/30 bg-success/5">
                <h4 className="font-medium text-success">Strengths</h4>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>- MTTD reduced by 28% due to AI-powered detection</li>
                  <li>- 96% of SLA targets achieved</li>
                  <li>- Zero critical security breaches</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg border border-warning/30 bg-warning/5">
                <h4 className="font-medium text-warning">Areas for Improvement</h4>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>- Patch compliance below target (88% vs 95% target)</li>
                  <li>- Legacy OT systems require modernization</li>
                  <li>- User awareness training completion at 78%</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Users className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium">Enhance Security Awareness</h4>
                  <p className="text-sm text-muted-foreground">Prioritize user training to reduce phishing incidents by 40%</p>
                  <Badge className="mt-2">Estimated ROI: 3.2x</Badge>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Shield className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium">Modernize OT Infrastructure</h4>
                  <p className="text-sm text-muted-foreground">Replace end-of-life systems to reduce attack surface by 60%</p>
                  <Badge className="mt-2">Investment Required: $2.4M</Badge>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Target className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium">Expand AI Coverage</h4>
                  <p className="text-sm text-muted-foreground">Deploy behavioural monitoring to additional 30% of assets</p>
                  <Badge className="mt-2">Implementation: 6 weeks</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}