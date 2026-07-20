'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Network, Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface Technique {
  id: string;
  name: string;
  description: string;
  detections: number;
  isDetected: boolean;
}

interface Tactic {
  name: string;
  techniques: Technique[];
}

const mitreTactics: Tactic[] = [
  {
    name: 'Reconnaissance',
    techniques: [
      { id: 'T1595', name: 'Active Scanning', description: 'Adversaries may scan for vulnerabilities', detections: 12, isDetected: true },
      { id: 'T1591', name: 'Gather Victim Host Info', description: 'Gathering information about victim hosts', detections: 0, isDetected: false },
    ],
  },
  {
    name: 'Resource Development',
    techniques: [
      { id: 'T1588', name: 'Obtain Capabilities', description: 'Adversaries may obtain capabilities', detections: 0, isDetected: false },
    ],
  },
  {
    name: 'Initial Access',
    techniques: [
      { id: 'T1566', name: 'Phishing', description: 'Adversaries may send phishing emails', detections: 28, isDetected: true },
      { id: 'T1190', name: 'Exploit Public App', description: 'Exploiting public-facing applications', detections: 15, isDetected: true },
      { id: 'T1133', name: 'External Remote Services', description: 'External remote service exploitation', detections: 8, isDetected: true },
      { id: 'T1078', name: 'Valid Accounts', description: 'Adversaries may use stolen credentials', detections: 34, isDetected: true },
    ],
  },
  {
    name: 'Execution',
    techniques: [
      { id: 'T1059', name: 'Command & Scripting', description: 'Command and script interpreter abuse', detections: 67, isDetected: true },
      { id: 'T1105', name: 'Ingress Tool Transfer', description: 'Adversaries may transfer tools', detections: 19, isDetected: true },
    ],
  },
  {
    name: 'Persistence',
    techniques: [
      { id: 'T1543', name: 'System Process', description: 'Create or modify system process', detections: 5, isDetected: true },
      { id: 'T1505', name: 'Server Software Component', description: 'Abuse server software', detections: 3, isDetected: true },
      { id: 'T1525', name: 'Implant Internal Image', description: 'Implant malicious container images', detections: 0, isDetected: false },
    ],
  },
  {
    name: 'Privilege Escalation',
    techniques: [
      { id: 'T1548', name: 'Elevation Control', description: 'Abuse elevation control mechanisms', detections: 11, isDetected: true },
    ],
  },
  {
    name: 'Defense Evasion',
    techniques: [
      { id: 'T1027', name: 'Obfuscated Files', description: 'Obfuscated files or information', detections: 23, isDetected: true },
      { id: 'T1055', name: 'Process Injection', description: 'Injecting code into processes', detections: 14, isDetected: true },
      { id: 'T1036', name: 'Masquerading', description: 'Disguise malicious files', detections: 9, isDetected: true },
      { id: 'T1484', name: 'Domain Policy Mod', description: 'Domain or tenant policy modification', detections: 2, isDetected: true },
      { id: 'T1562', name: 'Impair Defenses', description: 'Impair security defenses', detections: 6, isDetected: true },
      { id: 'T1027', name: 'Obfuscated Files', description: 'Obfuscated files or information', detections: 23, isDetected: true },
    ],
  },
  {
    name: 'Credential Access',
    techniques: [
      { id: 'T1003', name: 'OS Credential Dumping', description: 'Dump credentials from memory', detections: 18, isDetected: true },
      { id: 'T1110', name: 'Brute Force', description: 'Brute force credential guessing', detections: 42, isDetected: true },
    ],
  },
  {
    name: 'Discovery',
    techniques: [
      { id: 'T1087', name: 'Account Discovery', description: 'Discover accounts on systems', detections: 7, isDetected: true },
    ],
  },
  {
    name: 'Lateral Movement',
    techniques: [
      { id: 'T1021', name: 'Remote Services', description: 'Use remote services for movement', detections: 31, isDetected: true },
      { id: 'T1210', name: 'Exploit Remote Services', description: 'Exploit remote services vulnerabilities', detections: 12, isDetected: true },
    ],
  },
  {
    name: 'Collection',
    techniques: [
      { id: 'T1005', name: 'Data from Local System', description: 'Collect data from local systems', detections: 4, isDetected: true },
    ],
  },
  {
    name: 'Command & Control',
    techniques: [
      { id: 'T1071', name: 'Application Layer Protocol', description: 'Use application layer for C2', detections: 21, isDetected: true },
    ],
  },
  {
    name: 'Exfiltration',
    techniques: [
      { id: 'T1048', name: 'Exfil Over Alt Protocol', description: 'Exfiltrate over alternative protocol', detections: 3, isDetected: true },
    ],
  },
  {
    name: 'Impact',
    techniques: [
      { id: 'T1486', name: 'Data Encrypted for Impact', description: 'Ransomware data encryption', detections: 2, isDetected: true },
    ],
  },
];

export default function MITREMatrixPage() {
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null);
  const [selectedTactic, setSelectedTactic] = useState<string | null>(null);

  const getTechniqueColor = (technique: Technique) => {
    if (!technique.isDetected) return 'bg-muted hover:bg-muted/80';
    if (technique.detections >= 20) return 'bg-destructive/30 hover:bg-destructive/40 border-destructive/50';
    if (technique.detections >= 10) return 'bg-warning/30 hover:bg-warning/40 border-warning/50';
    return 'bg-success/30 hover:bg-success/40 border-success/50';
  };

  const totalDetections = mitreTactics.reduce((sum, t) =>
    sum + t.techniques.reduce((s, tech) => s + tech.detections, 0), 0);

  const coveragePercentage = Math.round(
    (mitreTactics.reduce((sum, t) =>
      sum + t.techniques.filter(tech => tech.isDetected).length, 0) /
    mitreTactics.reduce((sum, t) => sum + t.techniques.length, 0)) * 100
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MITRE ATT&CK Matrix</h1>
          <p className="text-muted-foreground">Adversary tactics, techniques, and detection coverage</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Detection Coverage</p>
            <p className="text-2xl font-bold text-success">{coveragePercentage}%</p>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Network className="h-3 w-3" />
            {totalDetections} Total Detections
          </Badge>
        </div>
      </div>

      {/* Legend */}
      <Card>
        <CardContent className="py-3">
          <div className="flex items-center gap-6">
            <span className="text-sm text-muted-foreground">Legend:</span>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-destructive/30 border border-destructive/50" />
              <span className="text-sm">High Activity (20+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-warning/30 border border-warning/50" />
              <span className="text-sm">Medium Activity (10-19)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-success/30 border border-success/50" />
              <span className="text-sm">Low Activity (1-9)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-muted" />
              <span className="text-sm">Not Detected</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MITRE Matrix */}
      <Card className="overflow-auto">
        <CardContent className="p-4">
          <div className="flex gap-2 min-w-max">
            {mitreTactics.map((tactic) => (
              <div key={tactic.name} className="flex flex-col w-40">
                <div className="bg-primary/20 border border-primary/30 rounded-t-lg p-3 text-center">
                  <p className="font-medium text-sm text-primary">{tactic.name}</p>
                </div>
                <div className="border border-border border-t-0 rounded-b-lg flex-1 p-2 space-y-1 bg-card">
                  {tactic.techniques.map((technique) => (
                    <button
                      key={technique.id}
                      className={`w-full text-left p-2 rounded border transition-all ${getTechniqueColor(technique)}`}
                      onClick={() => {
                        setSelectedTechnique(technique);
                        setSelectedTactic(tactic.name);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-muted-foreground">{technique.id}</span>
                        {technique.isDetected && (
                          <Badge variant="outline" className="text-xs h-5">
                            {technique.detections}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs mt-1 truncate">{technique.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technique Detail Dialog */}
      <Dialog open={!!selectedTechnique} onOpenChange={() => setSelectedTechnique(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTechnique?.isDetected ? (
                <AlertTriangle className="h-5 w-5 text-warning" />
              ) : (
                <Info className="h-5 w-5 text-muted-foreground" />
              )}
              {selectedTechnique?.id} - {selectedTechnique?.name}
            </DialogTitle>
            <DialogDescription>
              Tactic: {selectedTactic}
            </DialogDescription>
          </DialogHeader>
          {selectedTechnique && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedTechnique.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {selectedTechnique.isDetected ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="font-medium">
                      {selectedTechnique.isDetected ? 'Detected in Environment' : 'Not Detected'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedTechnique.detections} detection events in the last 30 days
                  </p>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <h5 className="font-medium mb-2">Risk Level</h5>
                  <Badge
                    variant="outline"
                    className={
                      selectedTechnique.detections >= 20
                        ? 'bg-destructive/20 text-destructive'
                        : selectedTechnique.detections >= 10
                        ? 'bg-warning/20 text-warning'
                        : 'bg-success/20 text-success'
                    }
                  >
                    {selectedTechnique.detections >= 20
                      ? 'High Activity'
                      : selectedTechnique.detections >= 10
                      ? 'Medium Activity'
                      : selectedTechnique.detections > 0
                      ? 'Low Activity'
                      : 'None'}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Recommended Mitigations</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>1. Implement network segmentation</li>
                  <li>2. Enable multi-factor authentication</li>
                  <li>3. Deploy endpoint detection and response (EDR)</li>
                  <li>4. Monitor for suspicious process execution</li>
                  <li>5. Implement least privilege access controls</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">View MITRE Details</Button>
                <Button>View Related Incidents</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}