import { supabase } from './supabase';
import type {
  Asset, Incident, ThreatIntel, MITRETechnique, UEBAEvent,
  SOARPlaybook, SOARAction, AttackPath, RiskScore
} from './types';

// ===== Assets API =====
export async function getAssets(filters?: {
  type?: string;
  environment?: string;
  criticality?: number;
  is_compromised?: boolean;
}): Promise<Asset[]> {
  let query = supabase.from('assets').select('*').order('risk_score', { ascending: false });

  if (filters?.type) query = query.eq('type', filters.type);
  if (filters?.environment) query = query.eq('environment', filters.environment);
  if (filters?.criticality) query = query.gte('criticality', filters.criticality);
  if (filters?.is_compromised !== undefined) query = query.eq('is_compromised', filters.is_compromised);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getAsset(id: string): Promise<Asset | null> {
  const { data, error } = await supabase.from('assets').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function createAsset(asset: Partial<Asset>): Promise<Asset> {
  const { data, error } = await supabase.from('assets').insert(asset).select().single();
  if (error) throw error;
  return data;
}

// ===== Incidents API =====
export async function getIncidents(filters?: {
  severity?: string;
  status?: string;
  category?: string;
  limit?: number;
}): Promise<Incident[]> {
  let query = supabase.from('incidents').select('*').order('first_detected', { ascending: false });

  if (filters?.severity) query = query.eq('severity', filters.severity);
  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.category) query = query.eq('category', filters.category);
  if (filters?.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getIncident(id: string): Promise<Incident | null> {
  const { data, error } = await supabase.from('incidents').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function createIncident(incident: Partial<Incident>): Promise<Incident> {
  const { data, error } = await supabase.from('incidents').insert(incident).select().single();
  if (error) throw error;
  return data;
}

export async function updateIncident(id: string, updates: Partial<Incident>): Promise<Incident> {
  const { data, error } = await supabase
    .from('incidents')
    .update({ ...updates, last_updated: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ===== Threat Intelligence API =====
export async function getThreatIntel(filters?: {
  ioc_type?: string;
  ioc_source?: string;
  is_active?: boolean;
}): Promise<ThreatIntel[]> {
  let query = supabase.from('threat_intel').select('*').order('created_at', { ascending: false });

  if (filters?.ioc_type) query = query.eq('ioc_type', filters.ioc_type);
  if (filters?.ioc_source) query = query.eq('ioc_source', filters.ioc_source);
  if (filters?.is_active !== undefined) query = query.eq('is_active', filters.is_active);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createThreatIntel(intel: Partial<ThreatIntel>): Promise<ThreatIntel> {
  const { data, error } = await supabase.from('threat_intel').insert(intel).select().single();
  if (error) throw error;
  return data;
}

// ===== MITRE ATT&CK API =====
export async function getMITRETechniques(): Promise<MITRETechnique[]> {
  const { data, error } = await supabase.from('mitre_techniques').select('*').order('tactic');
  if (error) throw error;
  return data || [];
}

export async function getMITREMatrix(): Promise<Record<string, MITRETechnique[]>> {
  const techniques = await getMITRETechniques();
  const matrix: Record<string, MITRETechnique[]> = {};

  for (const technique of techniques) {
    if (!matrix[technique.tactic]) {
      matrix[technique.tactic] = [];
    }
    matrix[technique.tactic].push(technique);
  }

  return matrix;
}

// ===== UEBA API =====
export async function getUEBAEvents(filters?: {
  anomaly_type?: string;
  user_id?: string;
  min_deviation_score?: number;
  limit?: number;
}): Promise<UEBAEvent[]> {
  let query = supabase.from('ueba_events').select('*').order('detected_at', { ascending: false });

  if (filters?.anomaly_type) query = query.eq('anomaly_type', filters.anomaly_type);
  if (filters?.user_id) query = query.eq('user_id', filters.user_id);
  if (filters?.min_deviation_score) query = query.gte('deviation_score', filters.min_deviation_score);
  if (filters?.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createUEBAEvent(event: Partial<UEBAEvent>): Promise<UEBAEvent> {
  const { data, error } = await supabase.from('ueba_events').insert(event).select().single();
  if (error) throw error;
  return data;
}

// ===== SOAR API =====
export async function getSOARPlaybooks(): Promise<SOARPlaybook[]> {
  const { data, error } = await supabase.from('soar_playbooks').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getSOARActions(filters?: {
  incident_id?: string;
  status?: string;
}): Promise<SOARAction[]> {
  let query = supabase.from('soar_actions').select('*').order('created_at', { ascending: false });

  if (filters?.incident_id) query = query.eq('incident_id', filters.incident_id);
  if (filters?.status) query = query.eq('status', filters.status);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createSOARAction(action: Partial<SOARAction>): Promise<SOARAction> {
  const { data, error } = await supabase.from('soar_actions').insert(action).select().single();
  if (error) throw error;
  return data;
}

export async function updateSOARAction(id: string, updates: Partial<SOARAction>): Promise<SOARAction> {
  const { data, error } = await supabase
    .from('soar_actions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ===== Attack Paths API =====
export async function getAttackPaths(filters?: {
  is_active?: boolean;
}): Promise<AttackPath[]> {
  let query = supabase.from('attack_paths').select('*').order('total_risk', { ascending: false });

  if (filters?.is_active !== undefined) query = query.eq('is_active', filters.is_active);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

// ===== Risk Scores API =====
export async function getRiskScores(filters?: {
  entity_type?: string;
  min_risk?: number;
}): Promise<RiskScore[]> {
  let query = supabase.from('risk_scores').select('*').order('overall_risk', { ascending: false });

  if (filters?.entity_type) query = query.eq('entity_type', filters.entity_type);
  if (filters?.min_risk) query = query.gte('overall_risk', filters.min_risk);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

// ===== Dashboard Stats API =====
export async function getDashboardStats() {
  const [
    { count: totalIncidents },
    { count: openIncidents },
    { count: criticalIncidents },
    { count: totalAssets },
    { count: compromisedAssets },
    { data: recentIncidents }
  ] = await Promise.all([
    supabase.from('incidents').select('*', { count: 'exact', head: true }),
    supabase.from('incidents').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('incidents').select('*', { count: 'exact', head: true }).eq('severity', 'critical'),
    supabase.from('assets').select('*', { count: 'exact', head: true }),
    supabase.from('assets').select('*', { count: 'exact', head: true }).eq('is_compromised', true),
    supabase.from('incidents').select('*').order('first_detected', { ascending: false }).limit(5)
  ]);

  // Calculate MTTD and MTTR from resolved incidents
  const { data: resolvedIncidents } = await supabase
    .from('incidents')
    .select('ttd_seconds, ttr_seconds')
    .not('status', 'is', 'open')
    .not('ttd_seconds', 'is', null);

  let avgTTD = 0;
  let avgTTR = 0;
  if (resolvedIncidents && resolvedIncidents.length > 0) {
    const validTTD = resolvedIncidents.filter(i => i.ttd_seconds).map(i => i.ttd_seconds as number);
    const validTTR = resolvedIncidents.filter(i => i.ttr_seconds).map(i => i.ttr_seconds as number);
    if (validTTD.length > 0) avgTTD = validTTD.reduce((a, b) => a + b, 0) / validTTD.length;
    if (validTTR.length > 0) avgTTR = validTTR.reduce((a, b) => a + b, 0) / validTTR.length;
  }

  return {
    totalIncidents: totalIncidents || 0,
    openIncidents: openIncidents || 0,
    criticalIncidents: criticalIncidents || 0,
    totalAssets: totalAssets || 0,
    compromisedAssets: compromisedAssets || 0,
    recentIncidents: recentIncidents || [],
    avgTTD,
    avgTTR
  };
}

export async function getAssetTypeDistribution() {
  const { data, error } = await supabase
    .from('assets')
    .select('type');

  if (error) throw error;

  const distribution: Record<string, number> = {};
  for (const asset of data || []) {
    distribution[asset.type] = (distribution[asset.type] || 0) + 1;
  }

  return Object.entries(distribution).map(([type, count]) => ({ type, count }));
}

export async function getIncidentTrend(days: number = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('incidents')
    .select('first_detected, severity')
    .gte('first_detected', startDate.toISOString())
    .order('first_detected', { ascending: true });

  if (error) throw error;

  // Group by date
  const trend: Record<string, { date: string; total: number; critical: number; high: number; medium: number; low: number }> = {};

  for (const incident of data || []) {
    const date = new Date(incident.first_detected).toISOString().split('T')[0];
    if (!trend[date]) {
      trend[date] = { date, total: 0, critical: 0, high: 0, medium: 0, low: 0 };
    }
    trend[date].total++;
    const sev = incident.severity as 'critical' | 'high' | 'medium' | 'low';
    if (sev in trend[date]) {
      trend[date][sev]++;
    }
  }

  return Object.values(trend);
}

export async function getSeverityDistribution() {
  const { data, error } = await supabase
    .from('incidents')
    .select('severity');

  if (error) throw error;

  const distribution: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
  for (const incident of data || []) {
    if (distribution[incident.severity] !== undefined) {
      distribution[incident.severity]++;
    }
  }

  return Object.entries(distribution).map(([severity, count]) => ({ severity, count }));
}
