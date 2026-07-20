'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: 'incident' | 'response' | 'detection' | 'mitigation';
  title: string;
  description: string;
  details?: string;
  user?: string;
  incident_id?: string;
}

const mockEvents: TimelineEvent[] = [
  { id: '1', timestamp: new Date(Date.now() - 5000), type: 'detection', title: 'Ransomware activity detected', description: 'Mass file encryption detected on OT-SERVER-03', details: '40,000 files encrypted in 2 minutes', incident_id: 'INC-001' },
  { id: '2', timestamp: new Date(Date.now() - 30000), type: 'incident', title: 'Critical incident created', description: 'Ransomware incident triggered', user: 'System', incident_id: 'INC-001' },
  { id: '3', timestamp: new Date(Date.now() - 60000), type: 'response', title: 'SOAR playbook initiated', description: 'Ransomware response playbook started', user: 'SentinelX AI', incident_id: 'INC-001' },
  { id: '4', timestamp: new Date(Date.now() - 120000), type: 'mitigation', title: 'Endpoint isolated', description: 'OT-SERVER-03 isolated from network', user: 'SOAR Agent', incident_id: 'INC-001' },
  { id: '5', timestamp: new Date(Date.now() - 180000), type: 'response', title: 'SOC notified', description: 'On-call analyst notified via PagerDuty', user: 'SOAR Agent', incident_id: 'INC-001' },
  { id: '6', timestamp: new Date(Date.now() - 240000), type: 'detection', title: 'Lateral movement detected', description: 'SMB connection from unauthorized subnet', incident_id: 'INC-002' },
  { id: '7', timestamp: new Date(Date.now() - 300000), type: 'incident', title: 'High severity incident created', description: 'Lateral movement incident triggered', user: 'System', incident_id: 'INC-002' },
  { id: '8', timestamp: new Date(Date.now() - 600000), type: 'detection', title: 'Credential dumping attempt', description: 'LSASS memory access detected on DC-01', incident_id: 'INC-003' },
  { id: '9', timestamp: new Date(Date.now() - 3600000), type: 'mitigation', title: 'Malicious process terminated', description: 'mimikatz.exe process killed on DC-01', user: 'EDR Agent', incident_id: 'INC-003' },
];

export default function TimelinePage() {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'detection': return 'bg-primary';
      case 'incident': return 'bg-destructive';
      case 'response': return 'bg-warning';
      case 'mitigation': return 'bg-success';
      default: return 'bg-muted';
    }
  };

  const getRelativeTime = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return { text: `${seconds}s ago`, detail: 'Just now' };
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return { text: `${minutes}m ago`, detail: `${minutes} minute${minutes > 1 ? 's' : ''} ago` };
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return { text: `${hours}h ago`, detail: `${hours} hour${hours > 1 ? 's' : ''} ago` };
    return { text: `${Math.floor(hours / 24)}d ago`, detail: date.toLocaleString() };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Incident Timeline</h1>
          <p className="text-muted-foreground">Chronological view of security events and responses</p>
        </div>
        <Button variant="outline" className="gap-1">
          <Calendar className="h-4 w-4" />
          Filter by Date
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Real-time Event Stream
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-6">
              {mockEvents.map((event, index) => (
                <div key={event.id} className="relative pl-10 cursor-pointer" onClick={() => setSelectedEvent(event)}>
                  <div className={`absolute left-0 w-4 h-4 rounded-full ${getTypeColor(event.type)} border-4 border-background animate-pulse`} />
                  <div className="bg-card border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground font-mono">
                        {getRelativeTime(event.timestamp).text}
                      </span>
                      {event.incident_id && (
                        <Badge variant="outline" className="text-xs">{event.incident_id}</Badge>
                      )}
                      <Badge variant="secondary" className="text-xs capitalize">{event.type}</Badge>
                    </div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    {event.user && (
                      <p className="text-xs text-muted-foreground mt-1">By: {event.user}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedEvent && (
        <Card>
          <CardHeader className="border-b border-border">
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getTypeColor(selectedEvent.type)}`} />
                <Badge variant="secondary" className="capitalize">{selectedEvent.type}</Badge>
              </div>
              <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
              <p className="text-muted-foreground">{selectedEvent.description}</p>
              {selectedEvent.details && (
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm">{selectedEvent.details}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Timestamp:</span>
                  <p className="font-mono">{selectedEvent.timestamp.toLocaleString()}</p>
                </div>
                {selectedEvent.user && (
                  <div>
                    <span className="text-muted-foreground">Executed By:</span>
                    <p>{selectedEvent.user}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}