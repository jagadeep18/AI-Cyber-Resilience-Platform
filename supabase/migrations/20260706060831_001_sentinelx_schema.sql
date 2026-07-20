/*
# SentinelX AI - Core Database Schema

1. Purpose
Complete schema for AI-powered Cyber Resilience Platform supporting:
- Asset inventory with IT/OT classification
- Security incidents and alerts
- Threat intelligence feeds
- MITRE ATT&CK framework mapping
- UEBA (User & Entity Behaviour Analytics) events
- SOAR (Security Orchestration, Automation & Response) playbooks
- Risk scoring and attack path analysis

2. Tables Created
- assets: Critical infrastructure assets (servers, workstations, network devices, OT systems)
- incidents: Security incidents with MITRE mapping
- threat_intel: Threat intelligence from various feeds
- mitre_techniques: MITRE ATT&CK framework data
- mitre_attack_mappings: Incident-to-technique relationships
- ueba_events: Behavioural anomaly events
- soar_playbooks: Automated response playbooks
- soar_actions: Executed response actions
- attack_paths: Computed attack paths
- risk_scores: Dynamic risk assessments

3. Security
- RLS enabled on all tables
- Policies allow anon + authenticated access for demo purposes
- All tables have proper indexing for query performance
*/

-- Assets table: Critical Infrastructure Assets
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('server', 'workstation', 'network_device', 'ot_system', 'database', 'cloud_instance', 'container', 'iot_device')),
  environment text NOT NULL CHECK (environment IN ('it', 'ot', 'hybrid', 'cloud')),
  ip_address text,
  mac_address text,
  os_type text,
  os_version text,
  criticality integer DEFAULT 3 CHECK (criticality BETWEEN 1 AND 5),
  location text,
  department text,
  owner text,
  tags text[] DEFAULT '{}',
  last_seen timestamptz,
  first_discovered timestamptz DEFAULT now(),
  vulnerability_count integer DEFAULT 0,
  risk_score decimal(5,2) DEFAULT 0.00,
  is_compromised boolean DEFAULT false,
  is_isolated boolean DEFAULT false,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type);
CREATE INDEX IF NOT EXISTS idx_assets_environment ON assets(environment);
CREATE INDEX IF NOT EXISTS idx_assets_criticality ON assets(criticality);
CREATE INDEX IF NOT EXISTS idx_assets_risk_score ON assets(risk_score DESC);

-- Incidents table: Security incidents
CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  severity text NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'contained', 'resolved', 'false_positive')),
  category text NOT NULL CHECK (category IN ('malware', 'ransomware', 'apt', 'insider_threat', 'data_exfiltration', 'lateral_movement', 'privilege_escalation', 'denial_of_service', 'phishing', 'zero_day', 'other')),
  source_ip text,
  target_asset_id uuid REFERENCES assets(id) ON DELETE SET NULL,
  attack_stage text CHECK (attack_stage IN ('reconnaissance', 'initial_access', 'execution', 'persistence', 'privilege_escalation', 'defense_evasion', 'credential_access', 'discovery', 'lateral_movement', 'collection', 'command_and_control', 'exfiltration', 'impact')),
  confidence decimal(5,4) DEFAULT 0.0000,
  mitre_tactics text[] DEFAULT '{}',
  mitre_techniques text[] DEFAULT '{}',
  threat_actor text,
  campaign text,
  iocs jsonb DEFAULT '{}',
  timeline jsonb DEFAULT '[]',
  response_actions jsonb DEFAULT '[]',
  impact_assessment jsonb DEFAULT '{}',
  assigned_to text,
  first_detected timestamptz DEFAULT now(),
  last_updated timestamptz DEFAULT now(),
  resolved_at timestamptz,
  ttd_seconds integer, -- Time to Detect
  ttr_seconds integer, -- Time to Respond
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(severity);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_category ON incidents(category);
CREATE INDEX IF NOT EXISTS idx_incidents_first_detected ON incidents(first_detected DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_target_asset ON incidents(target_asset_id);

-- Threat Intelligence table
CREATE TABLE IF NOT EXISTS threat_intel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ioc_type text NOT NULL CHECK (ioc_type IN ('ip', 'domain', 'url', 'hash_md5', 'hash_sha256', 'email', 'cve', 'threat_actor', 'campaign')),
  ioc_value text NOT NULL,
  ioc_source text NOT NULL CHECK (ioc_source IN ('mitre', 'cisa', 'cert_in', 'alienvault', 'abuseipdb', 'greynoise', 'virustotal', 'misp', 'custom')),
  threat_type text,
  threat_actor text,
  campaign text,
  malware_family text,
  mitre_techniques text[] DEFAULT '{}',
  confidence decimal(5,4) DEFAULT 0.5000,
  first_seen timestamptz,
  last_seen timestamptz,
  tags text[] DEFAULT '{}',
  raw_data jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(ioc_type, ioc_value, ioc_source)
);

CREATE INDEX IF NOT EXISTS idx_threat_intel_type ON threat_intel(ioc_type);
CREATE INDEX IF NOT EXISTS idx_threat_intel_source ON threat_intel(ioc_source);
CREATE INDEX IF NOT EXISTS idx_threat_intel_value ON threat_intel(ioc_value);

-- MITRE ATT&CK Techniques
CREATE TABLE IF NOT EXISTS mitre_techniques (
  id text PRIMARY KEY, -- e.g., T1566
  name text NOT NULL,
  description text,
  tactic text NOT NULL,
  subtechnique_of text REFERENCES mitre_techniques(id) ON DELETE CASCADE,
  platforms text[] DEFAULT '{}',
  data_sources text[] DEFAULT '{}',
  detection_methods text[] DEFAULT '{}',
  mitigations text[] DEFAULT '{}',
  kill_chain_phase text,
  is_subtechnique boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mitre_tactic ON mitre_techniques(tactic);

-- UEBA Events: Behavioural anomalies
CREATE TABLE IF NOT EXISTS ueba_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  user_name text,
  entity_type text NOT NULL CHECK (entity_type IN ('user', 'device', 'network', 'application', 'service')),
  entity_id text NOT NULL,
  event_type text NOT NULL,
  anomaly_type text NOT NULL CHECK (anomaly_type IN ('login_anomaly', 'data_access_anomaly', 'network_anomaly', 'process_anomaly', 'privilege_escalation', 'lateral_movement', 'data_exfiltration', 'beaconing', 'dns_tunneling', 'ransomware_behavior', 'insider_threat')),
  baseline_value decimal(15,4),
  observed_value decimal(15,4),
  deviation_score decimal(5,2),
  algorithm text CHECK (algorithm IN ('isolation_forest', 'autoencoder', 'lof', 'dbscan', 'statistical', 'lstm', 'ensemble')),
  features jsonb DEFAULT '{}',
  context jsonb DEFAULT '{}',
  related_incident_id uuid REFERENCES incidents(id) ON DELETE SET NULL,
  is_confirmed boolean DEFAULT false,
  is_false_positive boolean DEFAULT false,
  detected_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ueba_user ON ueba_events(user_id);
CREATE INDEX IF NOT EXISTS idx_ueba_anomaly_type ON ueba_events(anomaly_type);
CREATE INDEX IF NOT EXISTS idx_ueba_detected_at ON ueba_events(detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_ueba_deviation_score ON ueba_events(deviation_score DESC);

-- SOAR Playbooks
CREATE TABLE IF NOT EXISTS soar_playbooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('malware', 'ransomware', 'apt', 'insider_threat', 'data_exfiltration', 'lateral_movement', 'privilege_escalation', 'phishing', 'generic')),
  trigger_conditions jsonb NOT NULL,
  steps jsonb NOT NULL DEFAULT '[]',
  is_active boolean DEFAULT true,
  is_automated boolean DEFAULT false,
  requires_approval boolean DEFAULT true,
  approval_threshold text CHECK (approval_threshold IN ('low', 'medium', 'high', 'critical')),
  execution_count integer DEFAULT 0,
  success_rate decimal(5,2) DEFAULT 0.00,
  avg_execution_time_seconds integer,
  created_by text DEFAULT 'system',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_soar_playbooks_category ON soar_playbooks(category);
CREATE INDEX IF NOT EXISTS idx_soar_playbooks_active ON soar_playbooks(is_active);

-- SOAR Actions: Executed response actions
CREATE TABLE IF NOT EXISTS soar_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playbook_id uuid REFERENCES soar_playbooks(id) ON DELETE SET NULL,
  incident_id uuid REFERENCES incidents(id) ON DELETE CASCADE,
  action_type text NOT NULL CHECK (action_type IN ('block_ip', 'disable_account', 'kill_process', 'isolate_endpoint', 'create_ticket', 'snapshot_vm', 'notify_soc', 'quarantine_file', 'revoke_credential', 'update_firewall', 'collect_forensics', 'other')),
  target_entity text NOT NULL,
  target_type text CHECK (target_type IN ('ip', 'user', 'host', 'process', 'file', 'network', 'application')),
  parameters jsonb DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'success', 'failed', 'rolled_back')),
  confidence decimal(5,4) DEFAULT 0.0000,
  executed_by text DEFAULT 'system',
  execution_reason text,
  started_at timestamptz,
  completed_at timestamptz,
  rollback_available boolean DEFAULT true,
  rolled_back_at timestamptz,
  result jsonb DEFAULT '{}',
  audit_trail jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_soar_actions_incident ON soar_actions(incident_id);
CREATE INDEX IF NOT EXISTS idx_soar_actions_status ON soar_actions(status);
CREATE INDEX IF NOT EXISTS idx_soar_actions_type ON soar_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_soar_actions_created ON soar_actions(created_at DESC);

-- Attack Paths
CREATE TABLE IF NOT EXISTS attack_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_asset_id uuid REFERENCES assets(id) ON DELETE CASCADE,
  target_asset_id uuid REFERENCES assets(id) ON DELETE CASCADE,
  path_type text NOT NULL CHECK (path_type IN ('lateral_movement', 'privilege_escalation', 'credential_theft', 'data_exfiltration', 'persistence')),
  path_nodes jsonb NOT NULL DEFAULT '[]', -- Array of asset IDs representing the path
  path_edges jsonb NOT NULL DEFAULT '[]', -- Array of edges with technique IDs
  total_risk decimal(6,2),
  complexity integer CHECK (complexity BETWEEN 1 AND 10),
  exploited_vulnerabilities text[] DEFAULT '{}',
  mitre_techniques text[] DEFAULT '{}',
  is_active boolean DEFAULT false,
  last_calculated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_attack_paths_source ON attack_paths(source_asset_id);
CREATE INDEX IF NOT EXISTS idx_attack_paths_target ON attack_paths(target_asset_id);
CREATE INDEX IF NOT EXISTS idx_attack_paths_risk ON attack_paths(total_risk DESC);

-- Risk Scores
CREATE TABLE IF NOT EXISTS risk_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('asset', 'user', 'network', 'organization')),
  entity_id text NOT NULL,
  entity_name text,
  overall_risk decimal(5,2) DEFAULT 0.00 CHECK (overall_risk BETWEEN 0 AND 100),
  vulnerability_risk decimal(5,2) DEFAULT 0.00,
  threat_risk decimal(5,2) DEFAULT 0.00,
  behaviour_risk decimal(5,2) DEFAULT 0.00,
  exposure_risk decimal(5,2) DEFAULT 0.00,
  configuration_risk decimal(5,2) DEFAULT 0.00,
  risk_factors jsonb DEFAULT '{}',
  trend text DEFAULT 'stable' CHECK (trend IN ('increasing', 'decreasing', 'stable')),
  previous_score decimal(5,2),
  calculated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(entity_type, entity_id)
);

CREATE INDEX IF NOT EXISTS idx_risk_scores_entity ON risk_scores(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_risk_scores_overall ON risk_scores(overall_risk DESC);
CREATE INDEX IF NOT EXISTS idx_risk_scores_calculated ON risk_scores(calculated_at DESC);

-- Dashboard Metrics (pre-aggregated for performance)
CREATE TABLE IF NOT EXISTS dashboard_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type text NOT NULL,
  metric_value decimal(15,4) NOT NULL,
  metric_unit text,
  time_bucket timestamptz NOT NULL,
  dimensions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dashboard_metrics_type ON dashboard_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_dashboard_metrics_time ON dashboard_metrics(time_bucket DESC);

-- Enable RLS on all tables
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE threat_intel ENABLE ROW LEVEL SECURITY;
ALTER TABLE mitre_techniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE ueba_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE soar_playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE soar_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attack_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for single-tenant demo app (anon + authenticated)
-- Assets
DROP POLICY IF EXISTS "anon_crud_assets" ON assets;
CREATE POLICY "anon_crud_assets" ON assets FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_assets" ON assets FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_assets" ON assets FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_assets" ON assets FOR DELETE TO anon, authenticated USING (true);

-- Incidents
DROP POLICY IF EXISTS "anon_crud_incidents" ON incidents;
CREATE POLICY "anon_crud_incidents" ON incidents FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_incidents" ON incidents FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_incidents" ON incidents FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_incidents" ON incidents FOR DELETE TO anon, authenticated USING (true);

-- Threat Intel
DROP POLICY IF EXISTS "anon_crud_threat_intel" ON threat_intel;
CREATE POLICY "anon_crud_threat_intel" ON threat_intel FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_threat_intel" ON threat_intel FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_threat_intel" ON threat_intel FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_threat_intel" ON threat_intel FOR DELETE TO anon, authenticated USING (true);

-- MITRE Techniques
DROP POLICY IF EXISTS "anon_crud_mitre_techniques" ON mitre_techniques;
CREATE POLICY "anon_crud_mitre_techniques" ON mitre_techniques FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_mitre_techniques" ON mitre_techniques FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_mitre_techniques" ON mitre_techniques FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_mitre_techniques" ON mitre_techniques FOR DELETE TO anon, authenticated USING (true);

-- UEBA Events
DROP POLICY IF EXISTS "anon_crud_ueba_events" ON ueba_events;
CREATE POLICY "anon_crud_ueba_events" ON ueba_events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_ueba_events" ON ueba_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_ueba_events" ON ueba_events FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_ueba_events" ON ueba_events FOR DELETE TO anon, authenticated USING (true);

-- SOAR Playbooks
DROP POLICY IF EXISTS "anon_crud_soar_playbooks" ON soar_playbooks;
CREATE POLICY "anon_crud_soar_playbooks" ON soar_playbooks FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_soar_playbooks" ON soar_playbooks FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_soar_playbooks" ON soar_playbooks FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_soar_playbooks" ON soar_playbooks FOR DELETE TO anon, authenticated USING (true);

-- SOAR Actions
DROP POLICY IF EXISTS "anon_crud_soar_actions" ON soar_actions;
CREATE POLICY "anon_crud_soar_actions" ON soar_actions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_soar_actions" ON soar_actions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_soar_actions" ON soar_actions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_soar_actions" ON soar_actions FOR DELETE TO anon, authenticated USING (true);

-- Attack Paths
DROP POLICY IF EXISTS "anon_crud_attack_paths" ON attack_paths;
CREATE POLICY "anon_crud_attack_paths" ON attack_paths FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_attack_paths" ON attack_paths FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_attack_paths" ON attack_paths FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_attack_paths" ON attack_paths FOR DELETE TO anon, authenticated USING (true);

-- Risk Scores
DROP POLICY IF EXISTS "anon_crud_risk_scores" ON risk_scores;
CREATE POLICY "anon_crud_risk_scores" ON risk_scores FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_risk_scores" ON risk_scores FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_risk_scores" ON risk_scores FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_risk_scores" ON risk_scores FOR DELETE TO anon, authenticated USING (true);

-- Dashboard Metrics
DROP POLICY IF EXISTS "anon_crud_dashboard_metrics" ON dashboard_metrics;
CREATE POLICY "anon_crud_dashboard_metrics" ON dashboard_metrics FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_dashboard_metrics" ON dashboard_metrics FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_dashboard_metrics" ON dashboard_metrics FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_dashboard_metrics" ON dashboard_metrics FOR DELETE TO anon, authenticated USING (true);