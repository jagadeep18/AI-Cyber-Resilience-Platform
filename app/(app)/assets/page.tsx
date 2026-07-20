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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import {
  Server,
  Monitor,
  Router,
  Database,
  Cloud,
  Box,
  Cpu,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  Loader2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Asset {
  id: string;
  name: string;
  type: string;
  environment: string;
  ip_address: string;
  os_type: string;
  criticality: number;
  risk_score: number;
  is_compromised: boolean;
  is_isolated: boolean;
  vulnerability_count: number;
  department: string;
  owner: string;
  location: string;
  last_seen: string;
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [envFilter, setEnvFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'server',
    environment: 'it',
    ip_address: '',
    os_type: '',
    criticality: 3,
    department: '',
    owner: '',
    location: '',
  });

  useEffect(() => {
    fetchAssets();
  }, []);

  async function fetchAssets() {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('risk_score', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast.error('Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (isCreating) {
        const { error } = await supabase
          .from('assets')
          .insert([formData]);
        if (error) throw error;
        toast.success('Asset created successfully');
      } else if (selectedAsset) {
        const { error } = await supabase
          .from('assets')
          .update(formData)
          .eq('id', selectedAsset.id);
        if (error) throw error;
        toast.success('Asset updated successfully');
      }
      setIsCreating(false);
      setIsEditing(false);
      setSelectedAsset(null);
      fetchAssets();
    } catch (error) {
      console.error('Error saving asset:', error);
      toast.error('Failed to save asset');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this asset?')) return;
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Asset deleted');
      setSelectedAsset(null);
      fetchAssets();
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast.error('Failed to delete asset');
    }
  }

  async function handleIsolate(asset: Asset) {
    try {
      const { error } = await supabase
        .from('assets')
        .update({ is_isolated: !asset.is_isolated })
        .eq('id', asset.id);
      if (error) throw error;
      toast.success(asset.is_isolated ? 'Asset restored' : 'Asset isolated');
      fetchAssets();
    } catch (error) {
      toast.error('Failed to update asset status');
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'server': return <Server className="h-4 w-4" />;
      case 'workstation': return <Monitor className="h-4 w-4" />;
      case 'network_device': return <Router className="h-4 w-4" />;
      case 'database': return <Database className="h-4 w-4" />;
      case 'cloud_instance': return <Cloud className="h-4 w-4" />;
      case 'ot_system': return <Cpu className="h-4 w-4" />;
      case 'iot_device': return <Box className="h-4 w-4" />;
      default: return <Server className="h-4 w-4" />;
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return 'bg-destructive/20 text-destructive';
    if (risk >= 60) return 'bg-warning/20 text-warning';
    if (risk >= 40) return 'bg-primary/20 text-primary';
    return 'bg-success/20 text-success';
  };

  const getCriticalityStars = (criticality: number) => {
    return Array(criticality).fill(null).map((_, i) => <span key={i}>&#9733;</span>);
  };

  const filteredAssets = assets.filter(asset => {
    if (filter !== 'all' && asset.type !== filter) return false;
    if (envFilter !== 'all' && asset.environment !== envFilter) return false;
    if (search && !asset.name.toLowerCase().includes(search.toLowerCase()) &&
        !asset.ip_address?.includes(search)) return false;
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
          <h1 className="text-3xl font-bold tracking-tight">Asset Inventory</h1>
          <p className="text-muted-foreground">IT and OT asset management with risk assessment</p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={() => {
            setIsCreating(true);
            setFormData({
              name: '',
              type: 'server',
              environment: 'it',
              ip_address: '',
              os_type: '',
              criticality: 3,
              department: '',
              owner: '',
              location: '',
            });
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Assets</p>
                <p className="text-2xl font-bold">{assets.length}</p>
              </div>
              <Server className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">IT Assets</p>
                <p className="text-2xl font-bold">{assets.filter(a => a.environment === 'it').length}</p>
              </div>
              <Monitor className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">OT Assets</p>
                <p className="text-2xl font-bold">{assets.filter(a => a.environment === 'ot').length}</p>
              </div>
              <Cpu className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compromised</p>
                <p className="text-2xl font-bold text-destructive">{assets.filter(a => a.is_compromised).length}</p>
              </div>
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Isolated</p>
                <p className="text-2xl font-bold text-warning">{assets.filter(a => a.is_isolated).length}</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle>Asset List</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
                  className="pl-9 w-[250px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Asset Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="server">Servers</SelectItem>
                  <SelectItem value="workstation">Workstations</SelectItem>
                  <SelectItem value="network_device">Network</SelectItem>
                  <SelectItem value="database">Databases</SelectItem>
                  <SelectItem value="cloud_instance">Cloud</SelectItem>
                  <SelectItem value="ot_system">OT Systems</SelectItem>
                  <SelectItem value="iot_device">IoT Devices</SelectItem>
                </SelectContent>
              </Select>
              <Select value={envFilter} onValueChange={setEnvFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Env</SelectItem>
                  <SelectItem value="it">IT</SelectItem>
                  <SelectItem value="ot">OT</SelectItem>
                  <SelectItem value="cloud">Cloud</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>OS</TableHead>
                <TableHead>Criticality</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Vulns</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => {
                  setSelectedAsset(asset);
                  setIsEditing(false);
                }}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(asset.type)}
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-xs text-muted-foreground">{asset.department}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm">{asset.ip_address}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="uppercase">{asset.environment}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{asset.os_type}</TableCell>
                  <TableCell>
                    <span className="text-warning">{getCriticalityStars(asset.criticality)}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getRiskColor(asset.risk_score)}>
                      {asset.risk_score}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={asset.vulnerability_count > 5 ? 'destructive' : 'secondary'}>
                      {asset.vulnerability_count}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {asset.is_compromised ? (
                        <Badge variant="destructive">Compromised</Badge>
                      ) : asset.is_isolated ? (
                        <Badge className="bg-warning text-warning-foreground">Isolated</Badge>
                      ) : (
                        <Badge className="bg-success text-success-foreground">Secure</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <Button size="sm" variant="ghost" onClick={() => handleIsolate(asset)}>
                        {asset.is_isolated ? 'Restore' : 'Isolate'}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => {
                        setSelectedAsset(asset);
                        setIsEditing(true);
                        setFormData({
                          name: asset.name,
                          type: asset.type,
                          environment: asset.environment,
                          ip_address: asset.ip_address || '',
                          os_type: asset.os_type || '',
                          criticality: asset.criticality,
                          department: asset.department || '',
                          owner: asset.owner || '',
                          location: asset.location || '',
                        });
                      }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(asset.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreating || isEditing} onOpenChange={() => {
        setIsCreating(false);
        setIsEditing(false);
        setSelectedAsset(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isCreating ? 'Add New Asset' : 'Edit Asset'}</DialogTitle>
            <DialogDescription>
              {isCreating ? 'Add a new asset to the inventory.' : 'Update asset information.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="SERVER-01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="server">Server</SelectItem>
                    <SelectItem value="workstation">Workstation</SelectItem>
                    <SelectItem value="network_device">Network Device</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="cloud_instance">Cloud Instance</SelectItem>
                    <SelectItem value="ot_system">OT System</SelectItem>
                    <SelectItem value="iot_device">IoT Device</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="environment">Environment</Label>
                <Select value={formData.environment} onValueChange={(v) => setFormData({ ...formData, environment: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="ot">OT</SelectItem>
                    <SelectItem value="cloud">Cloud</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ip_address">IP Address</Label>
                <Input
                  id="ip_address"
                  value={formData.ip_address}
                  onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                  placeholder="10.0.0.1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="os_type">OS Type</Label>
                <Input
                  id="os_type"
                  value={formData.os_type}
                  onChange={(e) => setFormData({ ...formData, os_type: e.target.value })}
                  placeholder="Windows Server 2022"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="criticality">Criticality (1-5)</Label>
                <Select value={formData.criticality.toString()} onValueChange={(v) => setFormData({ ...formData, criticality: parseInt(v) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="IT"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner">Owner</Label>
                <Input
                  id="owner"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  placeholder="John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Data Center"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreating(false);
              setIsEditing(false);
            }}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isCreating ? 'Create' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Asset Detail Sheet */}
      <Sheet open={!!selectedAsset && !isEditing} onOpenChange={() => setSelectedAsset(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {selectedAsset && getTypeIcon(selectedAsset.type)}
              {selectedAsset?.name}
            </SheetTitle>
          </SheetHeader>
          {selectedAsset && (
            <div className="space-y-6 mt-6">
              <div className="flex items-center gap-2">
                {selectedAsset.is_compromised ? (
                  <Badge variant="destructive">Compromised</Badge>
                ) : selectedAsset.is_isolated ? (
                  <Badge className="bg-warning text-warning-foreground">Isolated</Badge>
                ) : (
                  <Badge className="bg-success text-success-foreground">Secure</Badge>
                )}
                <Badge variant="outline" className="uppercase">{selectedAsset.environment}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{selectedAsset.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">IP Address</p>
                  <p className="font-medium font-mono">{selectedAsset.ip_address || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">OS</p>
                  <p className="font-medium">{selectedAsset.os_type || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Criticality</p>
                  <p className="font-medium text-warning">{getCriticalityStars(selectedAsset.criticality)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Risk Score</p>
                  <p className={`font-bold text-2xl ${
                    selectedAsset.risk_score > 80 ? 'text-destructive' :
                    selectedAsset.risk_score > 50 ? 'text-warning' : 'text-success'
                  }`}>{selectedAsset.risk_score}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Vulnerabilities</p>
                  <p className="font-medium">{selectedAsset.vulnerability_count}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Department</p>
                  <p className="font-medium">{selectedAsset.department || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Owner</p>
                  <p className="font-medium">{selectedAsset.owner || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedAsset.location || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Seen</p>
                  <p className="font-medium">
                    {selectedAsset.last_seen
                      ? formatDistanceToNow(new Date(selectedAsset.last_seen), { addSuffix: true })
                      : 'Never'}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" variant="outline" onClick={() => handleIsolate(selectedAsset)}>
                  <Shield className="h-4 w-4 mr-2" />
                  {selectedAsset.is_isolated ? 'Restore' : 'Isolate'}
                </Button>
                <Button className="flex-1" variant="outline" onClick={() => {
                  setIsEditing(true);
                  setFormData({
                    name: selectedAsset.name,
                    type: selectedAsset.type,
                    environment: selectedAsset.environment,
                    ip_address: selectedAsset.ip_address || '',
                    os_type: selectedAsset.os_type || '',
                    criticality: selectedAsset.criticality,
                    department: selectedAsset.department || '',
                    owner: selectedAsset.owner || '',
                    location: selectedAsset.location || '',
                  });
                }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}