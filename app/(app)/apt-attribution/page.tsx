'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Target,
  Globe,
  Flag,
  Users,
  Shield,
  AlertTriangle,
  TrendingUp,
  Activity,
  Crosshair,
  Clock,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Treemap, Tooltip } from 'recharts';

interface APTActor {
  id: string;
  name: string;
  aliases: string[];
  country: string;
  motivation: string;
  firstSeen: string;
  targetSectors: string[];
  targetCountries: string[];
  ttps: string[];
  campaigns: Campaign[];
  confidence: number;
  activeIncidents: number;
}

interface Campaign {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  targets: string[];
  malware: string[];
  status: 'active' | 'dormant' | 'disrupted';
}

const aptActors: APTActor[] = [
  {
    id: 'apt29',
    name: 'APT29 (Cozy Bear)',
    aliases: ['Cozy Bear', 'The Dukes', 'Noblebaron'],
    country: 'Russia',
    motivation: 'Espionage',
    firstSeen: '2014',
    targetSectors: ['Government', 'Defense', 'Think Tanks', 'Healthcare'],
    targetCountries: ['USA', 'UK', 'Europe', 'NATO Members'],
    ttps: ['T1566.001', 'T1059.001', 'T1078', 'T1055', 'T1003', 'T1071.001'],
    campaigns: [
      { id: 'c1', name: 'SolarWinds Supply Chain', startDate: '2020-03', targets: ['US Government', 'Fortune 500'], malware: ['SUNBURST', 'TEARDROP'], status: 'disrupted' },
      { id: 'c2', name: 'Peace Rain', startDate: '2025-01', targets: ['European Ministries'], malware: ['SPAWN'], status: 'active' },
    ],
    confidence: 0.94,
    activeIncidents: 3,
  },
  {
    id: 'apt41',
    name: 'APT41 (Winnti Group)',
    aliases: ['Winnti', 'Barium', 'Wicked Panda'],
    country: 'China',
    motivation: 'Espionage & Financial Gain',
    firstSeen: '2007',
    targetSectors: ['Gaming', 'Technology', 'Healthcare', 'Telecom'],
    targetCountries: ['USA', 'Japan', 'South Korea', 'Southeast Asia'],
    ttps: ['T1195.002', 'T1059', 'T1546.008', 'T1078', 'T1567'],
    campaigns: [
      { id: 'c3', name: 'Operation Soft Cell', startDate: '2024-08', targets: ['Telecom Providers'], malware: ['ShadowPad', 'SNAPPY'], status: 'active' },
    ],
    confidence: 0.87,
    activeIncidents: 2,
  },
  {
    id: 'lazarus',
    name: 'Lazarus Group',
    aliases: ['Hidden Cobra', 'APT38', 'Andariel'],
    country: 'North Korea',
    motivation: 'Financial Gain & Sabotage',
    firstSeen: '2009',
    targetSectors: ['Financial', 'Defense', 'Energy', 'Media'],
    targetCountries: ['USA', 'South Korea', 'India', 'Global Banks'],
    ttps: ['T1566.001', 'T1036.005', 'T1059.003', 'T1490', 'T1486'],
    campaigns: [
      { id: 'c4', name: 'Dream Job Campaign', startDate: '2024-11', targets: ['Defense Contractors'], malware: ['DTrack', 'Manuscrypt'], status: 'active' },
      { id: 'c5', name: 'AppleJeus', startDate: '2025-02', targets: ['Cryptocurrency Exchanges'], malware: ['AppleJeus', 'FruitFly'], status: 'active' },
    ],
    confidence: 0.91,
    activeIncidents: 4,
  },
];

const capabilityRadar = [
  { capability: 'Initial Access', apt29: 95, apt41: 88, lazarus: 82 },
  { capability: 'Execution', apt29: 90, apt41: 92, lazarus: 88 },
  { capability: 'Persistence', apt29: 88, apt41: 94, lazarus: 90 },
  { capability: 'Defense Evasion', apt29: 92, apt41: 85, lazarus: 85 },
  { capability: 'Credential Access', apt29: 85, apt41: 88, lazarus: 80 },
  { capability: 'Exfiltration', apt29: 90, apt41: 78, lazarus: 92 },
  { capability: 'Impact', apt29: 75, apt41: 70, lazarus: 95 },
];

const attributionIndicators = [
  { name: 'TTP Matches', apt29: 45, apt41: 32, lazarus: 23, fill: '#ef4444' },
  { name: 'Infrastructure', apt29: 38, apt41: 28, lazarus: 34, fill: '#f97316' },
  { name: 'Malware Family', apt29: 52, apt41: 41, lazarus: 37, fill: '#eab308' },
  { name: 'Targeting Pattern', apt29: 35, apt41: 29, lazarus: 36, fill: '#22c55e' },
  { name: 'Timing Patterns', apt29: 28, apt41: 24, lazarus: 48, fill: '#3b82f6' },
];

export default function APTAttributionPage() {
  const [selectedActor, setSelectedActor] = useState<APTActor | null>(null);

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      Russia: '🇷🇺',
      China: '🇨🇳',
      'North Korea': '🇰🇵',
      Iran: '🇮🇷',
    };
    return flags[country] || '🏳️';
  };

  const getMotivationColor = (motivation: string) => {
    if (motivation.includes('Espionage')) return 'bg-primary';
    if (motivation.includes('Financial')) return 'bg-warning';
    return 'bg-secondary';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">APT Campaign Attribution</h1>
          <p className="text-muted-foreground">AI-powered threat actor identification and campaign tracking</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="gap-1">
            <Crosshair className="h-3 w-3" />
            3 Active Threat Actors
          </Badge>
          <Badge className="bg-destructive text-white gap-1">
            <AlertTriangle className="h-3 w-3" />
            9 Active Incidents
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Attribution Confidence</p>
                <p className="text-3xl font-bold text-primary">94%</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-3xl font-bold text-warning">5</p>
              </div>
              <Globe className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Nation-State Actors</p>
                <p className="text-3xl font-bold text-destructive">3</p>
              </div>
              <Flag className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-success/30 bg-success/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Attributions This Month</p>
                <p className="text-3xl font-bold text-success">12</p>
              </div>
              <Shield className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="actors" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="actors">Threat Actors</TabsTrigger>
          <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
          <TabsTrigger value="capabilities">Capability Analysis</TabsTrigger>
          <TabsTrigger value="attribution">Attribution Model</TabsTrigger>
        </TabsList>

        <TabsContent value="actors" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {aptActors.map((actor) => (
              <Card
                key={actor.id}
                className={`cursor-pointer transition-all hover:border-primary/50 ${selectedActor?.id === actor.id ? 'border-primary bg-primary/5' : ''}`}
                onClick={() => setSelectedActor(actor)}
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getCountryFlag(actor.country)}</span>
                    <div>
                      <CardTitle className="text-lg">{actor.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{actor.country}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className={getMotivationColor(actor.motivation)}>{actor.motivation}</Badge>
                    <Badge variant="outline">{actor.firstSeen}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Target Sectors</p>
                    <div className="flex flex-wrap gap-1">
                      {actor.targetSectors.slice(0, 3).map((sector) => (
                        <Badge key={sector} variant="secondary" className="text-xs">{sector}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                      <p className="text-lg font-bold text-primary">{Math.round(actor.confidence * 100)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Active Incidents</p>
                      <p className="text-lg font-bold text-destructive">{actor.activeIncidents}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedActor && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{getCountryFlag(selectedActor.country)}</span>
                  {selectedActor.name} - Detailed Analysis
                </CardTitle>
                <CardDescription>
                  Aliases: {selectedActor.aliases.join(', ')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Known TTPs (MITRE ATT&CK)</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedActor.ttps.map((ttp) => (
                        <Badge key={ttp} variant="outline" className="text-xs font-mono">{ttp}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Target Countries</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedActor.targetCountries.map((country) => (
                        <Badge key={country} variant="secondary" className="text-xs">{country}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active & Recent Campaigns</CardTitle>
              <CardDescription>Tracked operations with attributed threat actors</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Attributed Actor</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Targets</TableHead>
                    <TableHead>Malware</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aptActors.flatMap((actor) =>
                    actor.campaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{getCountryFlag(actor.country)}</span>
                            {actor.name.split(' ')[0]}
                          </div>
                        </TableCell>
                        <TableCell>{campaign.startDate}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {campaign.targets.map((t) => (
                              <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {campaign.malware.map((m) => (
                              <Badge key={m} variant="destructive" className="text-xs">{m}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              campaign.status === 'active' ? 'bg-destructive text-white' :
                              campaign.status === 'dormant' ? 'bg-warning text-black' : 'bg-success text-white'
                            }
                          >
                            {campaign.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capabilities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Threat Actor Capability Comparison</CardTitle>
              <CardDescription>Radar analysis of ATT&CK technique proficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={capabilityRadar}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="capability" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Radar name="APT29" dataKey="apt29" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                    <Radar name="APT41" dataKey="apt41" stroke="#f97316" fill="#f97316" fillOpacity={0.3} />
                    <Radar name="Lazarus" dataKey="lazarus" stroke="#eab308" fill="#eab308" fillOpacity={0.3} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Attribution Model</CardTitle>
              <CardDescription>
                Multi-indicator correlation for threat actor identification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-4">Indicator Weight Analysis</h4>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <Treemap
                        data={attributionIndicators}
                        dataKey="apt29"
                        aspectRatio={4 / 3}
                        stroke="hsl(var(--border))"
                      >
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                      </Treemap>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium mb-4">Attribation Pipeline</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Activity className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">TTP Extraction</p>
                        <p className="text-xs text-muted-foreground">MITRE ATT&CK technique matching</p>
                      </div>
                      <Badge className="ml-auto">87%</Badge>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Globe className="h-5 w-5 text-warning" />
                      <div>
                        <p className="font-medium">Infrastructure Analysis</p>
                        <p className="text-xs text-muted-foreground">C2 server and domain fingerprinting</p>
                      </div>
                      <Badge className="ml-auto bg-warning">79%</Badge>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Target className="h-5 w-5 text-destructive" />
                      <div>
                        <p className="font-medium">Malware Family Clustering</p>
                        <p className="text-xs text-muted-foreground">Code similarity and behavior matching</p>
                      </div>
                      <Badge className="ml-auto bg-destructive">92%</Badge>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Clock className="h-5 w-5 text-success" />
                      <div>
                        <p className="font-medium">Temporal Pattern Matching</p>
                        <p className="text-xs text-muted-foreground">Timing and operational patterns</p>
                      </div>
                      <Badge className="ml-auto bg-success">71%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
