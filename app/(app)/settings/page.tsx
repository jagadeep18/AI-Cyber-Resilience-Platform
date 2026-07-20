'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Settings,
  Shield,
  Bell,
  Database,
  Brain,
  Zap,
  Key,
  Globe,
  Save,
} from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Configure SentinelX AI platform settings</p>
        </div>
        <Button onClick={handleSave} className="gap-1">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {saved && (
        <div className="rounded-lg bg-success/10 border border-success/30 p-4">
          <p className="text-success">Settings saved successfully!</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Detection Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Detection Settings
            </CardTitle>
            <CardDescription>Configure threat detection parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="realtime">Real-time Detection</Label>
                  <p className="text-sm text-muted-foreground">Enable continuous threat monitoring</p>
                </div>
                <Switch id="realtime" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ml">ML Anomaly Detection</Label>
                  <p className="text-sm text-muted-foreground">Use machine learning models</p>
                </div>
                <Switch id="ml" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label>Confidence Threshold</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (60%)</SelectItem>
                    <SelectItem value="medium">Medium (75%)</SelectItem>
                    <SelectItem value="high">High (90%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sensitivity Level</Label>
                <Select defaultValue="balanced">
                  <SelectTrigger>
                    <SelectValue placeholder="Select sensitivity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="conservative">Conservative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Models */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Models
            </CardTitle>
            <CardDescription>Configure machine learning models</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="if">Isolation Forest</Label>
                  <p className="text-sm text-muted-foreground">Outlier detection</p>
                </div>
                <Switch id="if" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoencoder">Autoencoder</Label>
                  <p className="text-sm text-muted-foreground">Neural network reconstruction</p>
                </div>
                <Switch id="autoencoder" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="lstm">LSTM Model</Label>
                  <p className="text-sm text-muted-foreground">Time-series prediction</p>
                </div>
                <Switch id="lstm" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ensemble">Ensemble Model</Label>
                  <p className="text-sm text-muted-foreground">Combined model voting</p>
                </div>
                <Switch id="ensemble" defaultChecked />
              </div>

              <Button variant="outline" className="w-full">Retrain Models</Button>
            </div>
          </CardContent>
        </Card>

        {/* SOAR Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              SOAR Configuration
            </CardTitle>
            <CardDescription>Automated response settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-response">Auto Response</Label>
                  <p className="text-sm text-muted-foreground">Enable automated actions</p>
                </div>
                <Switch id="auto-response" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="approval">Require Approval</Label>
                  <p className="text-sm text-muted-foreground">Manual approval for high-risk actions</p>
                </div>
                <Switch id="approval" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label>Auto-isolation Threshold</Label>
                <Select defaultValue="critical">
                  <SelectTrigger>
                    <SelectValue placeholder="Select threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical Only</SelectItem>
                    <SelectItem value="high">Critical & High</SelectItem>
                    <SelectItem value="medium">Critical, High & Medium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="rollback">Auto Rollback</Label>
                  <p className="text-sm text-muted-foreground">Rollback on false positive</p>
                </div>
                <Switch id="rollback" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Alert notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>High Severity Alerts</Label>
                  <p className="text-sm text-muted-foreground">Critical and high incidents</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label>Notification Channels</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Switch id="email" />
                    <Label htmlFor="email">Email</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="slack" />
                    <Label htmlFor="slack">Slack</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="pagerduty" defaultChecked />
                    <Label htmlFor="pagerduty">PagerDuty</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email Recipients</Label>
                <Input placeholder="Enter email addresses (comma-separated)" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Integrations
            </CardTitle>
            <CardDescription>External service connections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'MITRE ATT&CK', status: 'connected' },
              { name: 'NVD CVE Database', status: 'connected' },
              { name: 'CISA Advisories', status: 'connected' },
              { name: 'CERT-In', status: 'connected' },
              { name: 'VirusTotal', status: 'disconnected' },
              { name: 'AlienVault OTX', status: 'disconnected' },
            ].map((integration) => (
              <div key={integration.name} className="flex items-center justify-between p-2 rounded bg-muted/50">
                <span className="text-sm">{integration.name}</span>
                <Badge variant={integration.status === 'connected' ? 'default' : 'secondary'} className={integration.status === 'connected' ? 'bg-success' : ''}>
                  {integration.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Database */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Database Settings
            </CardTitle>
            <CardDescription>Data retention and storage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Log Retention (days)</Label>
                <Input type="number" defaultValue="90" />
              </div>

              <div className="space-y-2">
                <Label>Incident Retention (days)</Label>
                <Input type="number" defaultValue="365" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-backup</Label>
                  <p className="text-sm text-muted-foreground">Daily database backups</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button variant="outline" className="w-full">Backup Now</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}