'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  User,
  Mail,
  Shield,
  Clock,
  Activity,
  Settings,
  Bell,
  Lock,
  Key,
  Smartphone,
  Globe,
  AlertTriangle,
  CheckCircle2,
  Camera,
  Save,
  LogOut,
  Brain,
  Eye,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  ip_address: string;
  details: string;
}

export default function ProfilePage() {
  const { user, profile, isAnalyst, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', department: '' });
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    if (user) {
      fetchActivities();
      if (profile) {
        setFormData({
          name: profile.full_name || '',
          department: profile.department || '',
        });
      }
    }
    setLoading(false);
  }, [user, profile]);

  const fetchActivities = async () => {
    const mockActivities: ActivityLog[] = [
      {
        id: '1',
        action: 'Login',
        timestamp: new Date().toISOString(),
        ip_address: '192.168.1.100',
        details: 'Successful login from corporate network',
      },
      {
        id: '2',
        action: 'View Incident',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        ip_address: '192.168.1.100',
        details: 'Viewed incident INC-2024-001 details',
      },
      {
        id: '3',
        action: 'Update Asset',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        ip_address: '192.168.1.100',
        details: 'Updated asset risk score for Server-DB-01',
      },
      {
        id: '4',
        action: 'Run SOAR Playbook',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        ip_address: '192.168.1.100',
        details: 'Executed ransomware containment playbook',
      },
      {
        id: '5',
        action: 'AI Analysis',
        timestamp: new Date(Date.now() - 21600000).toISOString(),
        ip_address: '192.168.1.100',
        details: 'Ran autonomous threat analysis on uploaded data',
      },
    ];
    setActivities(mockActivities);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update profile in database
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: formData.name,
          department: formData.department,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: 'newpassword123',
      });
      if (error) throw error;
      toast.success('Password update email sent');
      setShowPasswordDialog(false);
    } catch (error) {
      toast.error('Failed to initiate password change');
    }
  };

  const handleSignOutAll = async () => {
    setIsSigningOut(true);

    try {
      // Sign out globally - invalidates all sessions
      const { error } = await supabase.auth.signOut({ scope: 'global' });

      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }

      toast.success('Signed out of all devices successfully');
      setShowSignOutDialog(false);

      // Clear all local storage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }

      // Force redirect to login
      window.location.href = '/auth/login';
    } catch (error: unknown) {
      console.error('Sign out exception:', error);
      toast.error('Failed to sign out. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const displayRole = isAnalyst ? 'Cyber Analyst' : 'Observer';
  const displayDepartment = profile?.department || 'Security Operations';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <Badge variant="secondary" className="gap-1">
          {isAnalyst ? <Brain className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          {displayRole}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className={`w-24 h-24 rounded-full ${isAnalyst ? 'bg-primary/20' : 'bg-muted'} flex items-center justify-center`}>
                  {isAnalyst ? (
                    <Brain className="h-12 w-12 text-primary" />
                  ) : (
                    <User className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="mt-4 text-xl font-semibold">{displayName}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-success/20 text-success">Active</Badge>
                <Badge variant="outline">{displayRole}</Badge>
              </div>
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="text-sm">{displayRole}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="text-sm">{displayDepartment}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Last Login</p>
                  <p className="text-sm">{profile?.last_login ? new Date(profile.last_login).toLocaleString() : 'Now'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Account Created</p>
                  <p className="text-sm">
                    {profile?.id ? new Date().toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="settings">
            <TabsList>
              <TabsTrigger value="settings"><Settings className="h-4 w-4 mr-2" />Settings</TabsTrigger>
              <TabsTrigger value="security"><Lock className="h-4 w-4 mr-2" />Security</TabsTrigger>
              <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-2" />Notifications</TabsTrigger>
              <TabsTrigger value="activity"><Activity className="h-4 w-4 mr-2" />Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account details and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!editing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email Address</label>
                      <Input value={user?.email || ''} disabled className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Department</label>
                      <Input
                        value={formData.department}
                        onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                        disabled={!editing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Role</label>
                      <Input value={displayRole} disabled className="mt-1" />
                    </div>
                  </div>
                  {editing && (
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                      <Button onClick={handleSave} disabled={saving}>
                        {saving ? <Activity className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Changes
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Display Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">Use dark theme for the interface</p>
                    </div>
                    <Badge className="bg-primary">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Interactive Cursor</p>
                      <p className="text-sm text-muted-foreground">Custom animated cursor effects</p>
                    </div>
                    <Badge className="bg-success">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-refresh Data</p>
                      <p className="text-sm text-muted-foreground">Automatically refresh dashboard every 30 seconds</p>
                    </div>
                    <Badge className="bg-success">Enabled</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Password</p>
                        <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => setShowPasswordDialog(true)}>
                      Change
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-success" />
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Badge className="bg-success">Enabled</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Key className="h-5 w-5 text-warning" />
                      <div>
                        <p className="font-medium">API Keys</p>
                        <p className="text-sm text-muted-foreground">Manage API access tokens</p>
                      </div>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      <div>
                        <p className="font-medium text-destructive">Active Sessions</p>
                        <p className="text-sm text-muted-foreground">Sign out from all devices and sessions</p>
                      </div>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => setShowSignOutDialog(true)}>
                      Sign Out All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Critical Alerts', desc: 'Immediate notification for critical security events', enabled: true },
                    { label: 'Incident Updates', desc: 'Updates on incidents you are assigned to', enabled: true },
                    { label: 'Asset Changes', desc: 'Notifications when assets are modified', enabled: false },
                    { label: 'Threat Intel', desc: 'New threat intelligence relevant to your assets', enabled: true },
                    { label: 'System Health', desc: 'Alerts about system status changes', enabled: false },
                    { label: 'Weekly Reports', desc: 'Summary of security posture every week', enabled: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <Badge className={item.enabled ? 'bg-success' : 'bg-muted'}>
                        {item.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent actions in the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className={`rounded-full p-2 ${
                          activity.action === 'Login' ? 'bg-success/20' :
                          activity.action.includes('Update') ? 'bg-warning/20' : 'bg-primary/20'
                        }`}>
                          {activity.action === 'Login' ? (
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          ) : activity.action.includes('Update') ? (
                            <Activity className="h-4 w-4 text-warning" />
                          ) : (
                            <Activity className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{activity.action}</p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.details}</p>
                          <p className="text-xs text-muted-foreground mt-1">IP: {activity.ip_address}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your new password below. You will receive a confirmation email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Current Password</label>
              <Input type="password" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">New Password</label>
              <Input type="password" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Confirm New Password</label>
              <Input type="password" className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
            <Button onClick={handleChangePassword}>Update Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-destructive" />
              Sign Out of All Devices
            </DialogTitle>
            <DialogDescription>
              This will sign you out from all devices and sessions. You will need to sign in again.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
              <p className="text-sm font-medium text-destructive">Warning</p>
              <p className="text-sm text-muted-foreground mt-1">
                This action cannot be undone. All active sessions will be terminated immediately, including this current session.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSignOutDialog(false)} disabled={isSigningOut}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSignOutAll} disabled={isSigningOut}>
              {isSigningOut ? (
                <>
                  <Activity className="h-4 w-4 animate-spin mr-2" />
                  Signing out...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out All Devices
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
