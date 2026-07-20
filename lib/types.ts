// SentinelX AI - Type Definitions

export type AssetType = 'server' | 'workstation' | 'network_device' | 'ot_system' | 'database' | 'cloud_instance' | 'container' | 'iot_device';
export type Environment = 'it' | 'ot' | 'hybrid' | 'cloud';
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type IncidentStatus = 'open' | 'investigating' | 'contained' | 'resolved' | 'false_positive';
export type IncidentCategory = 'malware' | 'ransomware' | 'apt' | 'insider_threat' | 'data_exfiltration' | 'lateral_movement' | 'privilege_escalation' | 'denial_of_service' | 'phishing' | 'zero_day' | 'other';
export type AttackStage = 'reconnaissance' | 'initial_access' | 'execution' | 'persistence' | 'privilege_escalation' | 'defense_evasion' | 'credential_access' | 'discovery' | 'lateral_movement' | 'collection' | 'command_and_control' | 'exfiltration' | 'impact';
export type IOCType = 'ip' | 'domain' | 'url' | 'hash_md5' | 'hash_sha256' | 'email' | 'cve' | 'threat_actor' | 'campaign';
export type IOCSource = 'mitre' | 'cisa' | 'cert_in' | 'alienvault' | 'abuseipdb' | 'greynoise' | 'virustotal' | 'misp' | 'custom';
export type AnomalyType = 'login_anomaly' | 'data_access_anomaly' | 'network_anomaly' | 'process_anomaly' | 'privilege_escalation' | 'lateral_movement' | 'data_exfiltration' | 'beaconing' | 'dns_tunneling' | 'ransomware_behavior' | 'insider_threat';
export type AlgorithmType = 'isolation_forest' | 'autoencoder' | 'lof' | 'dbscan' | 'statistical' | 'lstm' | 'ensemble';
export type ActionType = 'block_ip' | 'disable_account' | 'kill_process' | 'isolate_endpoint' | 'create_ticket' | 'snapshot_vm' | 'notify_soc' | 'quarantine_file' | 'revoke_credential' | 'update_firewall' | 'collect_forensics' | 'other';
export type ActionStatus = 'pending' | 'running' | 'success' | 'failed' | 'rolled_back';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  environment: Environment;
  ip_address?: string;
  mac_address?: string;
  os_type?: string;
  os_version?: string;
  criticality: number;
  location?: string;
  department?: string;
  owner?: string;
  tags: string[];
  last_seen?: string;
  first_discovered: string;
  vulnerability_count: number;
  risk_score: number;
  is_compromised: boolean;
  is_isolated: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Incident {
  id: string;
  title: string;
  description?: string;
  severity: Severity;
  status: IncidentStatus;
  category: IncidentCategory;
  source_ip?: string;
  target_asset_id?: string;
  attack_stage?: AttackStage;
  confidence: number;
  mitre_tactics: string[];
  mitre_techniques: string[];
  threat_actor?: string;
  campaign?: string;
  iocs: Record<string, unknown>;
  timeline: TimelineEvent[];
  response_actions: ResponseAction[];
  impact_assessment: Record<string, unknown>;
  assigned_to?: string;
  first_detected: string;
  last_updated: string;
  resolved_at?: string;
  ttd_seconds?: number;
  ttr_seconds?: number;
  created_at: string;
}

export interface TimelineEvent {
  timestamp: string;
  event: string;
  details?: string;
  source?: string;
}

export interface ResponseAction {
  action: string;
  timestamp: string;
  status: string;
  result?: string;
}

export interface ThreatIntel {
  id: string;
  ioc_type: IOCType;
  ioc_value: string;
  ioc_source: IOCSource;
  threat_type?: string;
  threat_actor?: string;
  campaign?: string;
  malware_family?: string;
  mitre_techniques: string[];
  confidence: number;
  first_seen?: string;
  last_seen?: string;
  tags: string[];
  raw_data: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MITRETechnique {
  id: string;
  name: string;
  description?: string;
  tactic: string;
  subtechnique_of?: string;
  platforms: string[];
  data_sources: string[];
  detection_methods: string[];
  kill_chain_phase?: string;
  is_subtechnique: boolean;
  created_at: string;
  updated_at: string;
}

export interface UEBAEvent {
  id: string;
  user_id: string;
  user_name?: string;
  entity_type: 'user' | 'device' | 'network' | 'application' | 'service';
  entity_id: string;
  event_type: string;
  anomaly_type: AnomalyType;
  baseline_value: number;
  observed_value: number;
  deviation_score: number;
  algorithm?: AlgorithmType;
  features: Record<string, unknown>;
  context: Record<string, unknown>;
  related_incident_id?: string;
  is_confirmed: boolean;
  is_false_positive: boolean;
  detected_at: string;
  created_at: string;
}

export interface SOARPlaybook {
  id: string;
  name: string;
  description?: string;
  category: IncidentCategory | 'generic';
  trigger_conditions: Record<string, unknown>;
  steps: PlaybookStep[];
  is_active: boolean;
  is_automated: boolean;
  requires_approval: boolean;
  approval_threshold?: 'low' | 'medium' | 'high' | 'critical';
  execution_count: number;
  success_rate: number;
  avg_execution_time_seconds?: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PlaybookStep {
  order: number;
  action_type: ActionType;
  target?: string;
  parameters?: Record<string, unknown>;
  conditions?: Record<string, unknown>;
}

export interface SOARAction {
  id: string;
  playbook_id?: string;
  incident_id?: string;
  action_type: ActionType;
  target_entity: string;
  target_type?: 'ip' | 'user' | 'host' | 'process' | 'file' | 'network' | 'application';
  parameters: Record<string, unknown>;
  status: ActionStatus;
  confidence: number;
  executed_by: string;
  execution_reason?: string;
  started_at?: string;
  completed_at?: string;
  rollback_available: boolean;
  rolled_back_at?: string;
  result: Record<string, unknown>;
  audit_trail: AuditEntry[];
  created_at: string;
}

export interface AuditEntry {
  timestamp: string;
  action: string;
  user?: string;
  details?: string;
}

export interface AttackPath {
  id: string;
  source_asset_id: string;
  target_asset_id: string;
  path_type: 'lateral_movement' | 'privilege_escalation' | 'credential_theft' | 'data_exfiltration' | 'persistence';
  path_nodes: string[];
  path_edges: PathEdge[];
  total_risk?: number;
  complexity?: number;
  exploited_vulnerabilities: string[];
  mitre_techniques: string[];
  is_active: boolean;
  last_calculated: string;
  created_at: string;
}

export interface PathEdge {
  from: string;
  to: string;
  technique?: string;
  risk?: number;
}

export interface RiskScore {
  id: string;
  entity_type: 'asset' | 'user' | 'network' | 'organization';
  entity_id: string;
  entity_name?: string;
  overall_risk: number;
  vulnerability_risk: number;
  threat_risk: number;
  behaviour_risk: number;
  exposure_risk: number;
  configuration_risk: number;
  risk_factors: Record<string, unknown>;
  trend: 'increasing' | 'decreasing' | 'stable';
  previous_score?: number;
  calculated_at: string;
  created_at: string;
}

export interface DashboardMetric {
  id: string;
  metric_type: string;
  metric_value: number;
  metric_unit?: string;
  time_bucket: string;
  dimensions: Record<string, unknown>;
  created_at: string;
}

// Dashboard Summary Types
export interface DashboardSummary {
  active_incidents: number;
  critical_incidents: number;
  mean_time_to_detect: number;
  mean_time_to_respond: number;
  total_assets: number;
  compromised_assets: number;
  risk_trend: 'increasing' | 'decreasing' | 'stable';
  top_threat_actors: ThreatActorSummary[];
  recent_incidents: Incident[];
  asset_distribution: AssetDistribution[];
}

export interface ThreatActorSummary {
  name: string;
  incident_count: number;
  last_seen: string;
}

export interface AssetDistribution {
  type: AssetType;
  count: number;
}

// MITRE Matrix Types
export interface MITREMatrix {
  tactics: string[];
  techniques: Record<string, MITRETechnique[]>;
}
