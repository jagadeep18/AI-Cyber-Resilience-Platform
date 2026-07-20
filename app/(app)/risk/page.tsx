'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  Activity,
  Target,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Treemap,
} from 'recharts';

const riskData = [
  { name: 'Asset Risk', value: 68, fill: '#ef4444' },
  { name: 'Vulnerability', value: 45, fill: '#f59e0b' },
  { name: 'Threat Exposure', value: 72, fill: '#ef4444' },
  { name: 'Behaviour', value: 52, fill: '#f59e0b' },
  { name: 'Configuration', value: 38, fill: '#22c55e' },
];

const riskTrend = [
  { date: 'Mon', risk: 65 },
  { date: 'Tue', risk: 72 },
  { date: 'Wed', risk: 68 },
  { date: 'Thu', risk: 75 },
  { date: 'Fri', risk: 62 },
  { date: 'Sat', risk: 58 },
  { date: 'Sun', risk: 55 },
];

const assetRiskTreemap = [
  { name: 'OT-SERVER-03', size: 92, risk: 92 },
  { name: 'DC-01', size: 88, risk: 88 },
  { name: 'DATABASE-PROD', size: 76, risk: 76 },
  { name: 'SCADA-GW-01', size: 84, risk: 84 },
  { name: 'WEB-SERVER-01', size: 45, risk: 45 },
  { name: 'FILE-SERVER-02', size: 32, risk: 32 },
  { name: 'BACKUP-SRV', size: 28, risk: 28 },
];

export default function RiskDashboardPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'high'>('all');

  const getRiskLevel = () => {
    return 'High';
  };

  const riskLevel = getRiskLevel();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Risk Dashboard</h1>
          <p className="text-muted-foreground">Dynamic risk assessment and prioritization</p>
        </div>
        <div className="flex items-center gap-4">
          <Card className={`px-4 py-2 ${riskLevel === 'High' ? 'border-destructive/50 bg-destructive/5' : ''}`}>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${riskLevel === 'High' ? 'bg-destructive animate-pulse' : 'bg-success'}`} />
              <span className="text-sm font-medium">{riskLevel} Risk Level</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Risk Score Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="card-hover col-span-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Risk Score</p>
                <div className="flex items-center gap-2">
                  <p className="text-5xl font-bold">68</p>
                  <div className="flex flex-col">
                    <TrendingUp className="h-4 w-4 text-destructive" />
                    <span className="text-xs text-destructive">+12%</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Risk trend: Increasing</p>
              </div>
              <div className="h-28 w-28 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="10" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="10"
                    strokeDasharray={`${68 * 2.5} ${250}`} strokeLinecap="round" />
                </svg>
                <AlertTriangle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        {riskData.map((item) => (
          <Card key={item.name} className="card-hover">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">{item.name}</p>
                <p className="text-3xl font-bold mt-2" style={{ color: item.fill }}>{item.value}</p>
                <div className="h-2 mt-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.fill }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Risk Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Risk Trend (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" tick={{ fill: '#94a3b8' }} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                  <Tooltip />
                  <Bar dataKey="risk" fill="#f59e0b" radius={[4, 4, 0, 0]}>
                    {riskTrend.map((entry, index) => (
                      <rect key={index} fill={entry.risk > 70 ? '#ef4444' : entry.risk > 50 ? '#f59e0b' : '#22c55e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Asset Risk Treemap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Asset Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <div className="grid grid-cols-3 gap-2 h-full">
                  {assetRiskTreemap.map((asset, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-center rounded-lg p-3"
                      style={{
                        backgroundColor: asset.risk > 80 ? 'rgba(239, 68, 68, 0.2)' :
                          asset.risk > 50 ? 'rgba(245, 158, 11, 0.2)' :
                            'rgba(34, 197, 94, 0.2)',
                        borderLeft: `4px solid ${asset.risk > 80 ? '#ef4444' :
                          asset.risk > 50 ? '#f59e0b' : '#22c55e'}`
                      }}
                    >
                      <p className="text-xs text-muted-foreground truncate">{asset.name}</p>
                      <p className="text-xl font-bold" style={{
                        color: asset.risk > 80 ? '#ef4444' :
                          asset.risk > 50 ? '#f59e0b' : '#22c55e'
                      }}>{asset.risk}</p>
                    </div>
                  ))}
                </div>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Prioritization */}
      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle>Risk-Weighted Priorities</CardTitle>
            <Button variant="outline">Run Risk Assessment</Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-6">
            {/* Risk Factor Analysis */}
            <div>
              <h4 className="text-sm font-medium mb-3">Top Risk Factors</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Critical Vulnerabilities</span>
                    <Badge variant="destructive">High Impact</Badge>
                  </div>
                  <p className="text-xl font-bold text-destructive mt-2">23</p>
                  <p className="text-xs text-muted-foreground">CVSS score &gt; 9.0</p>
                </div>
                <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Threat Campaigns</span>
                    <Badge className="bg-warning/20 text-warning">Medium Impact</Badge>
                  </div>
                  <p className="text-xl font-bold text-warning mt-2">5</p>
                  <p className="text-xs text-muted-foreground">APT29, APT41, LockBit, Conti</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Exposed Attack Surface</span>
                    <Badge variant="secondary">Moderate</Badge>
                  </div>
                  <p className="text-xl font-bold mt-2">147</p>
                  <p className="text-xs text-muted-foreground">Public-facing assets</p>
                </div>
                <div className="rounded-lg border border-success/30 bg-success/5 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Compliance Score</span>
                    <Badge className="bg-success/20 text-success">Good</Badge>
                  </div>
                  <p className="text-xl font-bold text-success mt-2">94%</p>
                  <p className="text-xs text-muted-foreground">ISO 27001 compliance</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}