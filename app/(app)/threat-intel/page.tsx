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
  Server,
  AlertTriangle,
  Shield,
  Activity,
  Lock,
  ExternalLink,
  Filter,
  Search,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ThreatIntel {
  id: string;
  ioc_type: string;
  ioc_value: string;
  ioc_source: string;
  threat_actor?: string;
  malware_family?: string;
  mitre_techniques: string[];
  confidence: number;
  tags: string[];
  is_active: boolean;
  first_seen?: string;
  last_seen?: string;
}

const mockThreatIntel: ThreatIntel[] = [
  {
    id: '1',
    ioc_type: 'ip',
    ioc_value: '185.234.72.45',
    ioc_source: 'cisa',
    threat_actor: 'APT29',
    malware_family: 'CozyBear',
    mitre_techniques: ['T1071', 'T1566', 'T1059'],
    confidence: 0.94,
    tags: ['apt', 'russia', 'government'],
    is_active: true,
    first_seen: '2024-01-15',
    last_seen: '2024-01-20',
  },
  {
    id: '2',
    ioc_type: 'domain',
    ioc_value: 'malicious-cdn.net',
    ioc_source: 'mitre',
    threat_actor: 'APT41',
    malware_family: 'Cobalt Strike',
    mitre_techniques: ['T1059', 'T1055', 'T1078'],
    confidence: 0.88,
    tags: ['apt', 'china', 'supply-chain'],
    is_active: true,
    first_seen: '2024-01-10',
    last_seen: '2024-01-18',
  },
  {
    id: '3',
    ioc_type: 'hash_sha256',
    ioc_value: 'a1b2c3d4e5f6...',
    ioc_source: 'virustotal',
    malware_family: 'LockBit',
    mitre_techniques: ['T1486', 'T1027', 'T1490'],
    confidence: 0.96,
    tags: ['ransomware', 'lockbit', 'financial'],
    is_active: true,
    first_seen: '2024-01-12',
  },
  {
    id: '4',
    ioc_type: 'cve',
    ioc_value: 'CVE-2024-1709',
    ioc_source: 'nvd',
    mitre_techniques: ['T1190'],
    confidence: 0.99,
    tags: ['cve', 'critical', 'exploit'],
    is_active: true,
  },
  {
    id: '5',
    ioc_type: 'email',
    ioc_value: 'phisher@malicious-domain.com',
    ioc_source: 'cert_in',
    threat_actor: 'Unknown',
    mitre_techniques: ['T1566'],
    confidence: 0.82,
    tags: ['phishing', 'india', 'financial'],
    is_active: true,
    first_seen: '2024-01-08',
    last_seen: '2024-01-15',
  },
];

export default function ThreatIntelPage() {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const getIOCTypeIcon = (type: string) => {
    switch (type) {
      case 'ip':
        return <Globe className="h-4 w-4" />;
      case 'domain':
        return <Server className="h-4 w-4" />;
      case 'hash_md5':
      case 'hash_sha256':
        return <Lock className="h-4 w-4" />;
      case 'cve':
        return <AlertTriangle className="h-4 w-4" />;
      case 'email':
        return <Target className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getSourceBadge = (source: string) => {
    const colors: Record<string, string> = {
      cisa: 'bg-orange-500/20 text-orange-400',
      mitre: 'bg-primary/20 text-primary',
      virustotal: 'bg-success/20 text-success',
      nvd: 'bg-warning/20 text-warning',
      cert_in: 'bg-purple-500/20 text-purple-400',
      alienvault: 'bg-cyan-500/20 text-cyan-400',
    };
    return colors[source] || 'bg-muted text-muted-foreground';
  };

  const filteredIntel = mockThreatIntel.filter(intel => {
    if (filter !== 'all' && intel.ioc_type !== filter) return false;
    if (search && !intel.ioc_value.toLowerCase().includes(search.toLowerCase()) &&
        !intel.mitre_techniques?.some(t => t.toLowerCase().includes(search.toLowerCase()))) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Threat Intelligence</h1>
          <p className="text-muted-foreground">Aggregated IOCs, CVEs, and threat actor intelligence</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="gap-1">
            <Activity className="h-3 w-3" />
            {mockThreatIntel.filter(t => t.is_active).length} Active IOCs
          </Badge>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Refresh Feeds
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total IOCs</p>
                <p className="text-2xl font-bold">{mockThreatIntel.length}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">APT Groups Tracked</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Feeds Active</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Activity className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mitigations Mapped</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Threat Intel Table */}
      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle>Intelligence Feed</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search IOCs..."
                  className="pl-9 w-[250px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="IOC Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="ip">IP Addresses</SelectItem>
                  <SelectItem value="domain">Domains</SelectItem>
                  <SelectItem value="hash_sha256">Hashes</SelectItem>
                  <SelectItem value="cve">CVEs</SelectItem>
                  <SelectItem value="email">Emails</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>IOC Value</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Threat Actor</TableHead>
                <TableHead>MITRE Techniques</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIntel.map((intel) => (
                <TableRow key={intel.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getIOCTypeIcon(intel.ioc_type)}
                      <span className="capitalize">{intel.ioc_type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-2 py-1 text-sm">
                      {intel.ioc_value.length > 20
                        ? `${intel.ioc_value.substring(0, 20)}...`
                        : intel.ioc_value}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getSourceBadge(intel.ioc_source)}>
                      {intel.ioc_source.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{intel.threat_actor || '-'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {intel.mitre_techniques.slice(0, 3).map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${intel.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(intel.confidence * 100)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={intel.is_active ? 'default' : 'secondary'}
                      className={intel.is_active ? 'bg-success text-success-foreground' : ''}
                    >
                      {intel.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}