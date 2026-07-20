'use client';

import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Shield,
  Activity,
  Brain,
  Target,
  Network,
  Server,
  Calendar,
  Users,
  Zap,
  TrendingUp,
  BarChart3,
  Settings,
  Bot,
  AlertTriangle,
  Radio,
  Home,
  Sparkles,
  Cpu,
  GitBranch,
  Gauge,
  Radar,
  User,
  TestTube,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  analystOnly?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
  analystOnly?: boolean;
}

const navigation: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/', icon: Home },
      { name: 'SOC Console', href: '/soc', icon: Radio },
      { name: 'Executive View', href: '/executive', icon: BarChart3 },
    ],
  },
  {
    title: 'Threat Analysis',
    items: [
      { name: 'Threat Intel', href: '/threat-intel', icon: Target, analystOnly: true },
      { name: 'MITRE Matrix', href: '/mitre', icon: Network },
      { name: 'Attack Graph', href: '/attack-graph', icon: Activity, analystOnly: true },
    ],
  },
  {
    title: 'Assets & Incidents',
    items: [
      { name: 'Asset Inventory', href: '/assets', icon: Server, analystOnly: true },
      { name: 'Incidents', href: '/incidents', icon: AlertTriangle, analystOnly: true },
      { name: 'Timeline', href: '/timeline', icon: Calendar },
    ],
  },
  {
    title: 'AI & Analytics',
    items: [
      { name: 'AI Analysis', href: '/ai-analysis', icon: Sparkles, analystOnly: true },
      { name: 'UEBA', href: '/ueba', icon: Users, analystOnly: true },
      { name: 'Risk Dashboard', href: '/risk', icon: TrendingUp },
      { name: 'AI Copilot', href: '/copilot', icon: Bot },
    ],
  },
  {
    title: 'Advanced AI',
    analystOnly: true,
    items: [
      { name: 'APT Attribution', href: '/apt-attribution', icon: Target },
      { name: 'Vulnerability Priority', href: '/vulnerability', icon: Gauge },
      { name: 'Digital Twin', href: '/digital-twin', icon: Cpu },
      { name: 'Correlation Engine', href: '/correlation', icon: GitBranch },
      { name: 'Attack Progression', href: '/progression', icon: Radar },
    ],
  },
  {
    title: 'Response',
    items: [
      { name: 'SOAR', href: '/soar', icon: Zap, analystOnly: true },
      { name: 'AI Agents', href: '/agents', icon: Bot, analystOnly: true },
      { name: 'Settings', href: '/settings', icon: Settings },
    ],
  },
  {
    title: 'System',
    items: [
      { name: 'Profile', href: '/profile', icon: User },
      { name: 'Demo & Testing', href: '/demo', icon: TestTube },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAnalyst, profile } = useAuth();

  const filteredNavigation = navigation.filter(group => {
    if (group.analystOnly && !isAnalyst) return false;
    return true;
  }).map(group => ({
    ...group,
    items: group.items.filter(item => !item.analystOnly || isAnalyst),
  })).filter(group => group.items.length > 0);

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="relative">
          <Shield className="h-8 w-8 text-primary" />
          <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-success animate-pulse" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight">SentinelX</span>
          <span className="ml-1 text-xs text-primary">AI</span>
        </div>
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-6 px-3">
          {filteredNavigation.map((group) => (
            <div key={group.title}>
              <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.title}
              </h3>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <li key={item.name}>
                      <Button
                        variant="ghost"
                        className={cn(
                          'w-full justify-start gap-3 px-3',
                          isActive
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                        )}
                        onClick={() => router.push(item.href)}
                      >
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t border-border p-4 space-y-3">
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
          {isAnalyst ? (
            <Brain className="h-5 w-5 text-primary" />
          ) : (
            <Eye className="h-5 w-5 text-muted-foreground" />
          )}
          <div className="flex-1">
            <p className="text-xs font-medium">
              {isAnalyst ? 'Cyber Analyst' : 'Observer Mode'}
            </p>
            <p className="text-xs text-muted-foreground">
              {profile?.email?.split('@')[0] || 'User'}
            </p>
          </div>
          <Badge variant={isAnalyst ? 'default' : 'secondary'} className="text-xs">
            {isAnalyst ? 'Full' : 'View'}
          </Badge>
        </div>

        {isAnalyst && (
          <div className="flex items-center gap-2 rounded-lg bg-success/10 p-2">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <p className="text-xs text-muted-foreground">7 AI modules running</p>
          </div>
        )}
      </div>
    </div>
  );
}
