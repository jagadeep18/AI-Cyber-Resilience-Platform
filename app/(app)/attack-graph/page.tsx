'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Activity,
  Server,
  ArrowRight,
  GitBranch,
  Shield,
  AlertTriangle,
  Target,
} from 'lucide-react';

interface AttackNode {
  id: string;
  name: string;
  type: 'asset' | 'technique';
  risk: number;
  compromised: boolean;
  x: number;
  y: number;
}

interface AttackEdge {
  from: string;
  to: string;
  technique: string;
  risk: number;
}

const attackGraphNodes: AttackNode[] = [
  { id: '1', name: 'Internet', type: 'asset', risk: 0, compromised: false, x: 100, y: 200 },
  { id: '2', name: 'Phishing Emails', type: 'technique', risk: 0.8, compromised: true, x: 200, y: 200 },
  { id: '3', name: 'WORKSTATION-01', type: 'asset', risk: 65, compromised: true, x: 300, y: 150 },
  { id: '4', name: 'WORKSTATION-05', type: 'asset', risk: 45, compromised: true, x: 300, y: 250 },
  { id: '5', name: 'Credential Dumping', type: 'technique', risk: 0.9, compromised: true, x: 400, y: 200 },
  { id: '6', name: 'DC-01', type: 'asset', risk: 92, compromised: false, x: 500, y: 200 },
  { id: '7', name: 'Lateral Movement', type: 'technique', risk: 0.85, compromised: false, x: 600, y: 200 },
  { id: '8', name: 'DATABASE-PROD', type: 'asset', risk: 88, compromised: false, x: 700, y: 200 },
  { id: '9', name: 'Exfiltration', type: 'technique', risk: 0.95, compromised: false, x: 800, y: 200 },
  { id: '10', name: 'External Server', type: 'asset', risk: 0, compromised: false, x: 900, y: 200 },
];

const attackEdges: AttackEdge[] = [
  { from: '1', to: '2', technique: 'T1566', risk: 0.8 },
  { from: '2', to: '3', technique: 'T1566.001', risk: 0.9 },
  { from: '2', to: '4', technique: 'T1566.001', risk: 0.85 },
  { from: '3', to: '5', technique: 'T1003', risk: 0.92 },
  { from: '4', to: '5', technique: 'T1003', risk: 0.88 },
  { from: '5', to: '6', technique: 'T1021', risk: 0.95 },
  { from: '6', to: '7', technique: 'T1021.001', risk: 0.9 },
  { from: '7', to: '8', technique: 'T1021', risk: 0.87 },
  { from: '8', to: '9', technique: 'T1048', risk: 0.94 },
  { from: '9', to: '10', technique: 'T1048.003', risk: 0.96 },
];

export default function AttackGraphPage() {
  const [selectedNode, setSelectedNode] = useState<AttackNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<AttackEdge | null>(null);

  const getNodeColor = (node: AttackNode) => {
    if (node.type === 'technique') {
      return node.compromised ? 'bg-destructive' : 'bg-warning';
    }
    if (node.compromised) return 'bg-destructive';
    if (node.risk > 80) return 'bg-orange-500';
    if (node.risk > 50) return 'bg-yellow-500';
    return 'bg-success';
  };

  const getEdgeColor = (edge: AttackEdge) => {
    if (edge.risk > 0.9) return '#ef4444';
    if (edge.risk > 0.7) return '#f59e0b';
    return '#3b82f6';
  };

  const compromisedAssets = attackGraphNodes.filter(n => n.compromised && n.type === 'asset').length;
  const criticalPaths = attackEdges.filter(e => e.risk > 0.8).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attack Graph</h1>
          <p className="text-muted-foreground">Visualize attack paths and lateral movement risk</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            {compromisedAssets} Compromised
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <GitBranch className="h-3 w-3" />
            {criticalPaths} Critical Paths
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Attack Paths</p>
                <p className="text-2xl font-bold">{attackEdges.length}</p>
              </div>
              <GitBranch className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compromised Nodes</p>
                <p className="text-2xl font-bold text-destructive">{compromisedAssets}</p>
              </div>
              <Server className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Max Path Risk</p>
                <p className="text-2xl font-bold">{Math.max(...attackEdges.map(e => e.risk)).toFixed(2)}</p>
              </div>
              <Target className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Crown Jewels at Risk</p>
                <p className="text-2xl font-bold">
                  {attackGraphNodes.filter(n => n.type === 'asset' && n.risk > 80).length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attack Graph Visualization */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Attack Path Visualization
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative h-[500px] bg-card grid-overlay overflow-auto">
              <svg width="100%" height="100%" viewBox="0 0 1000 400">
                {/* Edges */}
                {attackEdges.map((edge, index) => {
                  const fromNode = attackGraphNodes.find(n => n.id === edge.from);
                  const toNode = attackGraphNodes.find(n => n.id === edge.to);
                  if (!fromNode || !toNode) return null;

                  const midX = (fromNode.x + toNode.x) / 2;
                  const midY = (fromNode.y + toNode.y) / 2 - 30;

                  return (
                    <g key={index}>
                      <defs>
                        <marker
                          id={`arrow-${index}`}
                          markerWidth="10"
                          markerHeight="10"
                          refX="9"
                          refY="3"
                          orient="auto"
                          markerUnits="strokeWidth"
                        >
                          <path
                            d="M0,0 L0,6 L9,3 z"
                            fill={getEdgeColor(edge)}
                          />
                        </marker>
                      </defs>
                      <path
                        d={`M ${fromNode.x} ${fromNode.y} Q ${midX} ${midY} ${toNode.x - 20} ${toNode.y}`}
                        fill="none"
                        stroke={getEdgeColor(edge)}
                        strokeWidth={edge.risk * 3}
                        strokeOpacity={0.5}
                        markerEnd={`url(#arrow-${index})`}
                        className="cursor-pointer hover:stroke-opacity-100"
                        onClick={() => setSelectedEdge(edge)}
                      />
                      <text
                        x={midX}
                        y={midY}
                        fill="#94a3b8"
                        fontSize="10"
                        textAnchor="middle"
                      >
                        {edge.technique}
                      </text>
                    </g>
                  );
                })}

                {/* Nodes */}
                {attackGraphNodes.map((node) => (
                  <g
                    key={node.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedNode(node)}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={20}
                      fill={node.type === 'technique' ? 'transparent' : `hsl(var(--card))`}
                      stroke={getNodeColor(node)}
                      strokeWidth={3}
                      className={`${node.compromised ? 'animate-pulse' : ''}`}
                    />
                    {node.type === 'technique' && (
                      <polygon
                        points={`${node.x},${node.y - 18} ${node.x + 18},${node.y + 10} ${node.x - 18},${node.y + 10}`}
                        fill="hsl(var(--card))"
                        stroke={getNodeColor(node)}
                        strokeWidth={3}
                      />
                    )}
                    <text
                      x={node.x}
                      y={node.y + 40}
                      fill="#94a3b8"
                      fontSize="10"
                      textAnchor="middle"
                    >
                      {node.name.substring(0, 15)}
                      {node.name.length > 15 && '...'}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Details Panel */}
        <Card className="h-[600px] overflow-auto">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {!selectedNode && !selectedEdge ? (
              <div className="flex flex-col items-center justify-center h-[480px] text-muted-foreground">
                <Activity className="h-12 w-12 mb-2 opacity-50" />
                <p className="text-sm">Click a node or edge to view details</p>
              </div>
            ) : selectedNode ? (
              <div className="space-y-4">
                <div>
                  <Badge variant={selectedNode.compromised ? 'destructive' : 'secondary'}>
                    {selectedNode.type}
                  </Badge>
                </div>
                <h3 className="font-semibold">{selectedNode.name}</h3>

                {selectedNode.type === 'asset' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Risk Score</span>
                      <span className="font-medium">{selectedNode.risk}/100</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <span className={selectedNode.compromised ? 'text-destructive' : 'text-success'}>
                        {selectedNode.compromised ? 'Compromised' : 'Secure'}
                      </span>
                    </div>
                  </div>
                )}

                {selectedNode.type === 'technique' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Exploitation Risk</span>
                      <span className="font-medium">{(selectedNode.risk * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <span className={selectedNode.compromised ? 'text-destructive' : 'text-warning'}>
                        {selectedNode.compromised ? 'Exploited' : 'At Risk'}
                      </span>
                    </div>
                  </div>
                )}

                <div className="pt-4 space-y-2">
                  <Button className="w-full" variant="outline">
                    View Asset Details
                  </Button>
                  <Button className="w-full">
                    Isolate Endpoint
                  </Button>
                </div>
              </div>
            ) : selectedEdge ? (
              <div className="space-y-4">
                <Badge variant="outline">Attack Path</Badge>
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-2">
                    <code className="text-sm text-primary">{selectedEdge.technique}</code>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    from {attackGraphNodes.find(n => n.id === selectedEdge.from)?.name}
                  </p>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    to {attackGraphNodes.find(n => n.id === selectedEdge.to)?.name}
                  </p>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Path Risk</span>
                  <span className="font-medium">{(selectedEdge.risk * 100).toFixed(0)}%</span>
                </div>
                <Button className="w-full" variant="outline">
                  Block Technique
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Info({ className }: { className?: string }) {
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
}