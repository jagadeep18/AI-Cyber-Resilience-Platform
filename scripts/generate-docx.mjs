import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
  PageBreak,
  Header,
  Footer,
  PageNumber,
  TabStopType,
  TabStopPosition,
} from 'docx';
import * as fs from 'fs';
import * as path from 'path';

const BRAND_COLOR = '1A1A2E';
const ACCENT_COLOR = '0F4C75';
const SUCCESS_COLOR = '2D6A4F';
const WARNING_COLOR = 'B47B00';
const DANGER_COLOR = '9B1C1C';
const LIGHT_BG = 'F0F4F8';

function heading(text, level, color = ACCENT_COLOR) {
  return new Paragraph({
    heading: level,
    spacing: { before: 300, after: 150 },
    children: [
      new TextRun({
        text,
        bold: true,
        color,
        size: level === HeadingLevel.HEADING_1 ? 36 : level === HeadingLevel.HEADING_2 ? 28 : 24,
        font: 'Calibri',
      }),
    ],
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    alignment: opts.align,
    spacing: { after: opts.spacingAfter ?? 120, line: 360 },
    children: [
      new TextRun({
        text,
        bold: opts.bold,
        italics: opts.italic,
        color: opts.color,
        size: opts.size ?? 22,
        font: 'Calibri',
      }),
    ],
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    bullet: { level },
    spacing: { after: 80, line: 340 },
    children: [new TextRun({ text, size: 22, font: 'Calibri' })],
  });
}

function bulletBold(label, text, level = 0) {
  return new Paragraph({
    bullet: { level },
    spacing: { after: 80, line: 340 },
    children: [
      new TextRun({ text: label, bold: true, size: 22, font: 'Calibri' }),
      new TextRun({ text: ` ${text}`, size: 22, font: 'Calibri' }),
    ],
  });
}

function tableCell(text, opts = {}) {
  return new TableCell({
    width: { size: opts.width ?? 50, type: WidthType.PERCENTAGE },
    shading: opts.bg ? { fill: opts.bg, type: ShadingType.CLEAR, color: 'auto' } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [
      new Paragraph({
        alignment: opts.align,
        children: [new TextRun({ text, bold: opts.bold, color: opts.color, size: 20, font: 'Calibri' })],
      }),
    ],
  });
}

function makeTable(headers, rows, colWidths) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => tableCell(h, { bold: true, color: 'FFFFFF', bg: ACCENT_COLOR, width: colWidths?.[i] })),
  });
  const dataRows = rows.map((row, idx) => new TableRow({
    children: row.map((cell, i) => tableCell(cell, { bg: idx % 2 === 0 ? LIGHT_BG : undefined, width: colWidths?.[i] })),
  }));
  return new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'EEEEEE' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'EEEEEE' },
    },
  });
}

function spacer(after = 200) { return new Paragraph({ spacing: { after } }); }
function divider() { return new Paragraph({ spacing: { before: 100, after: 100 }, border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: ACCENT_COLOR } }, children: [] }); }
function pageBreak() { return new Paragraph({ children: [new PageBreak()] }); }

const children = [];

// ═══════════════════════════════════════════════════════════════════════
// COVER PAGE
// ═══════════════════════════════════════════════════════════════════════

children.push(
  new Paragraph({ spacing: { before: 2400 } }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'SentinelX AI', bold: true, size: 72, color: BRAND_COLOR, font: 'Calibri' })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'AI-Powered Cyber Resilience Platform', size: 36, color: ACCENT_COLOR, font: 'Calibri' })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [new TextRun({ text: 'Comprehensive Project Documentation', italics: true, size: 28, color: '666666', font: 'Calibri' })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Next-generation Security Operations Center with autonomous threat detection,', size: 22, color: '555555', font: 'Calibri' })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 1200 }, children: [new TextRun({ text: 'MITRE ATT&CK mapping, behavioural analytics, and AI-driven incident response.', size: 22, color: '555555', font: 'Calibri' })] }),
  divider(),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 100 }, children: [new TextRun({ text: 'Technology Stack', bold: true, size: 24, color: BRAND_COLOR, font: 'Calibri' })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Next.js 13.5  |  React 18  |  TypeScript 5  |  Supabase  |  Tailwind CSS', size: 20, color: '666666', font: 'Calibri' })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Radix UI  |  Framer Motion  |  Recharts  |  Google Gemini AI  |  Deno Edge Functions', size: 20, color: '666666', font: 'Calibri' })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 600, after: 100 }, children: [new TextRun({ text: 'Document Version: 1.0', size: 20, color: '999999', font: 'Calibri' })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Generated: ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), size: 20, color: '999999', font: 'Calibri' })] }),
  pageBreak(),
);

// ═══════════════════════════════════════════════════════════════════════
// TABLE OF CONTENTS
// ═══════════════════════════════════════════════════════════════════════

children.push(heading('Table of Contents', HeadingLevel.HEADING_1), spacer(100));

const tocItems = [
  '1.  Project Overview',
  '2.  Objectives & Goals',
  '3.  Feature Overview',
  '4.  System Architecture',
  '5.  Database Schema',
  '6.  Module Specifications',
  '       6.1  Dashboard',
  '       6.2  SOC Console',
  '       6.3  MITRE ATT&CK Matrix',
  '       6.4  Asset Inventory',
  '       6.5  Incident Management',
  '       6.6  Threat Intelligence',
  '       6.7  UEBA (Behavioural Analytics)',
  '       6.8  SOAR (Automated Response)',
  '       6.9  AI Copilot',
  '       6.10  Risk Dashboard',
  '       6.11  Attack Graph',
  '       6.12  APT Attribution',
  '       6.13  Vulnerability Prioritisation',
  '       6.14  Digital Twin',
  '       6.15  Correlation Engine',
  '       6.16  Attack Progression',
  '       6.17  AI Agents',
  '       6.18  Timeline',
  '       6.19  Executive View',
  '       6.20  Demo & Testing',
  '7.  Authentication & Role-Based Access',
  '8.  AI Copilot Implementation',
  '9.  Security Model',
  '10. Technology Stack',
  '11. Project Structure',
  '12. Deployment Guide',
  '13. Roadmap',
  '14. Conclusion',
];

tocItems.forEach((item) => {
  const isSub = item.startsWith('       ');
  children.push(new Paragraph({
    spacing: { after: 60, line: 340 },
    children: [new TextRun({ text: item.trim(), size: isSub ? 20 : 22, color: isSub ? '666666' : BRAND_COLOR, bold: !isSub, font: 'Calibri' })],
  }));
});

children.push(pageBreak());

// ═══════════════════════════════════════════════════════════════════════
// 1. PROJECT OVERVIEW
// ═══════════════════════════════════════════════════════════════════════

children.push(
  heading('1. Project Overview', HeadingLevel.HEADING_1),
  divider(),
  para('SentinelX AI is a comprehensive, production-grade cyber resilience platform that transforms how security teams detect, analyse, and respond to threats. It combines traditional Security Operations Center (SOC) tooling with cutting-edge artificial intelligence to deliver a unified, intelligent security operations experience.'),
  para('The platform is designed to serve as a central hub for security analysts, executives, and observers — providing role-appropriate access to real-time security data, threat intelligence, behavioural analytics, automated response capabilities, and an AI-powered conversational assistant.'),
  para('At its core, SentinelX AI addresses the growing complexity of modern cyber threats by leveraging AI to reduce detection and response times, automate repetitive security tasks, and provide intelligent, context-aware recommendations for incident response.'),
  spacer(),
  para('Key Capabilities:', { bold: true, size: 24, color: BRAND_COLOR }),
  bulletBold('Real-time Detection:', 'Continuous monitoring of assets, incidents, and behavioural anomalies across IT and OT environments.'),
  bulletBold('AI-Powered Analysis:', 'Google Gemini-driven copilot for natural-language security queries with live database context.'),
  bulletBold('MITRE ATT&CK Mapping:', 'Full kill-chain coverage with technique-level detection and visualisation.'),
  bulletBold('SOAR Automation:', 'Playbook-driven, approval-gated automated response with full audit trails and rollback support.'),
  bulletBold('Risk Scoring:', 'Multi-dimensional dynamic risk assessment across assets, users, networks, and the organisation.'),
  bulletBold('APT Attribution:', 'Threat actor identification and campaign tracking with confidence scoring.'),
  bulletBold('Digital Twin:', 'Simulated infrastructure environment for attack modelling and predictive analysis.'),
);

// ═══════════════════════════════════════════════════════════════════════
// 2. OBJECTIVES & GOALS
// ═══════════════════════════════════════════════════════════════════════

children.push(
  heading('2. Objectives & Goals', HeadingLevel.HEADING_1),
  divider(),
  para('The primary objectives of SentinelX AI are:'),
  spacer(100),
  makeTable(
    ['Objective', 'Description'],
    [
      ['Reduce MTTD', 'Decrease Mean Time to Detect through AI-assisted continuous monitoring and behavioural anomaly detection.'],
      ['Reduce MTTR', 'Decrease Mean Time to Respond through SOAR automation and AI-driven response recommendations.'],
      ['Unify Security Tooling', 'Consolidate SOC, threat intel, UEBA, SOAR, and risk management into a single platform.'],
      ['Enable AI-Assisted Decisions', 'Provide analysts with an AI copilot that can query live data and offer actionable insights.'],
      ['Map to MITRE ATT&CK', 'Map all detected threats to the MITRE ATT&CK framework for standardised analysis.'],
      ['Role-Based Access', 'Support both full-access analysts and read-only observers with appropriate data filtering.'],
      ['Scalable Architecture', 'Use serverless infrastructure (Supabase + Edge Functions) for cost-effective scaling.'],
    ],
    [30, 70]
  ),
);

// ═══════════════════════════════════════════════════════════════════════
// 3. FEATURE OVERVIEW
// ═══════════════════════════════════════════════════════════════════════

children.push(
  heading('3. Feature Overview', HeadingLevel.HEADING_1),
  divider(),
  para('SentinelX AI provides 20+ modules across four major categories:'),
  spacer(100),
  heading('3.1 Core Platform Modules', HeadingLevel.HEADING_2),
  makeTable(
    ['Module', 'Description'],
    [
      ['Dashboard', 'Unified security operations overview with KPIs, recent incidents, high-risk assets, and quick actions.'],
      ['SOC Console', 'Real-time incident queue with severity filtering, triage, and SOAR action tracking.'],
      ['Executive View', 'High-level metrics and trends for leadership reporting.'],
      ['Asset Inventory', 'Full IT/OT asset registry with criticality scoring, compromise status, and isolation tracking.'],
      ['Incidents', 'Complete incident lifecycle management with MITRE mapping and timeline reconstruction.'],
      ['Timeline', 'Chronological incident reconstruction with kill-chain stage visualisation.'],
      ['Risk Dashboard', 'Multi-factor risk scoring across vulnerability, threat, behaviour, exposure, and configuration.'],
      ['Settings', 'Platform configuration and preferences.'],
      ['Profile', 'User profile and role management.'],
    ],
    [25, 75]
  ),
  spacer(200),
  heading('3.2 AI & Machine Learning Modules', HeadingLevel.HEADING_2),
  makeTable(
    ['Module', 'Description'],
    [
      ['AI Copilot', 'Conversational AI assistant powered by Google Gemini with live database context. Query incidents, assets, threats, and get actionable recommendations.'],
      ['AI Analysis', 'Automated incident analysis with confidence scoring, MITRE technique mapping, and recommended response actions.'],
      ['UEBA', 'User & Entity Behaviour Analytics — anomaly detection using isolation forest, autoencoder, LOF, DBSCAN, LSTM, and ensemble algorithms.'],
      ['AI Agents', 'Autonomous AI agents for continuous monitoring, investigation, and response orchestration.'],
    ],
    [25, 75]
  ),
  spacer(200),
  heading('3.3 Advanced Threat Analysis Modules', HeadingLevel.HEADING_2),
  makeTable(
    ['Module', 'Description'],
    [
      ['Threat Intel', 'Aggregated threat intelligence from MITRE, CISA, CERT-In, AlienVault, AbuseIPDB, GreyNoise, VirusTotal, and MISP feeds.'],
      ['MITRE Matrix', 'Interactive ATT&CK framework matrix with technique-level detection coverage across all 14 tactics.'],
      ['Attack Graph', 'Visual attack path analysis showing lateral movement and privilege escalation routes between assets.'],
      ['APT Attribution', 'Advanced Persistent Threat actor identification and campaign correlation with confidence scoring.'],
      ['Vulnerability Priority', 'AI-driven vulnerability prioritisation based on exploitability, exposure, and asset criticality.'],
      ['Digital Twin', 'Digital replica of the infrastructure for attack simulation and what-if analysis.'],
      ['Correlation Engine', 'Cross-source event correlation to identify complex, multi-stage attack patterns.'],
      ['Attack Progression', 'Predictive attack progression modelling showing likely next attacker moves.'],
    ],
    [25, 75]
  ),
  spacer(200),
  heading('3.4 Response & Automation Modules', HeadingLevel.HEADING_2),
  makeTable(
    ['Module', 'Description'],
    [
      ['SOAR', 'Security Orchestration, Automation & Response — playbook-driven automated response with approval workflows.'],
      ['SOAR Actions', 'Executed response actions (block IP, disable account, isolate endpoint, quarantine file, etc.) with full audit trail and rollback support.'],
    ],
    [25, 75]
  ),
);

// ═══════════════════════════════════════════════════════════════════════
// 4. SYSTEM ARCHITECTURE
// ═══════════════════════════════════════════════════════════════════════

children.push(
  pageBreak(),
  heading('4. System Architecture', HeadingLevel.HEADING_1),
  divider(),
  para('SentinelX AI follows a serverless-first architecture using Supabase for database, authentication, and edge functions, with a Next.js frontend for the user interface.'),
  spacer(100),
  heading('4.1 Architecture Layers', HeadingLevel.HEADING_2),
  makeTable(
    ['Layer', 'Technology', 'Responsibility'],
    [
      ['Presentation', 'Next.js + React + Tailwind CSS', 'Renders the UI, handles client-side state, and manages user interactions.'],
      ['Authentication', 'Supabase Auth', 'Manages email/password authentication, session tokens, and user profiles with roles.'],
      ['Data Access', 'Supabase JS SDK', 'Provides real-time data fetching with row-level security enforced at the database level.'],
      ['Database', 'Supabase PostgreSQL', 'Stores all security data with 10+ tables, comprehensive indexing, and RLS policies.'],
      ['Edge Functions', 'Deno Runtime (Supabase)', 'Runs serverless functions for AI Copilot (Gemini integration) and other backend logic.'],
      ['AI Engine', 'Google Gemini API', 'Powers the conversational AI copilot with security-focused system prompts.'],
      ['Deployment', 'Netlify', 'Hosts the Next.js application with continuous deployment.'],
    ],
    [18, 32, 50]
  ),
  spacer(200),
  heading('4.2 Key Architectural Principles', HeadingLevel.HEADING_2),
  bulletBold('Serverless-First:', 'Supabase handles auth, database, and edge functions — no traditional server management required.'),
  bulletBold('Row-Level Security:', 'Every database table is protected by RLS policies, ensuring data access is controlled at the database level.'),
  bulletBold('Real-time Data:', 'Live data fetching with Supabase real-time subscriptions for up-to-the-second security monitoring.'),
  bulletBold('Role-Based Access:', 'Analyst vs. Observer access enforced at both the UI layer (route protection) and data layer (RLS).'),
  bulletBold('Edge AI:', 'The AI Copilot runs as a Deno edge function for low-latency inference, directly connecting to the Gemini API.'),
  bulletBold('Type Safety:', 'Full TypeScript coverage across the application ensures compile-time safety and better developer experience.'),
);

// ═══════════════════════════════════════════════════════════════════════
// 5. DATABASE SCHEMA
// ═══════════════════════════════════════════════════════════════════════

children.push(
  pageBreak(),
  heading('5. Database Schema', HeadingLevel.HEADING_1),
  divider(),
  para('The platform uses 10 core PostgreSQL tables with comprehensive indexing and Row-Level Security (RLS) policies. The schema is defined across three migration files:'),
  spacer(100),
  makeTable(
    ['Table', 'Purpose', 'Key Fields'],
    [
      ['assets', 'IT/OT asset inventory', 'type, environment, criticality, risk_score, is_compromised, is_isolated, vulnerability_count'],
      ['incidents', 'Security incidents', 'severity, status, category, mitre_techniques, confidence, ttd_seconds, ttr_seconds, attack_stage'],
      ['threat_intel', 'Threat intelligence IOCs', 'ioc_type, ioc_value, ioc_source, threat_actor, campaign, malware_family'],
      ['mitre_techniques', 'MITRE ATT&CK framework', 'tactic, platforms, detection_methods, mitigations, kill_chain_phase'],
      ['ueba_events', 'Behavioural anomalies', 'anomaly_type, deviation_score, algorithm, features, entity_type'],
      ['soar_playbooks', 'Automated response playbooks', 'trigger_conditions, steps, is_automated, requires_approval, approval_threshold'],
      ['soar_actions', 'Executed response actions', 'action_type, status, confidence, audit_trail, rollback_available'],
      ['attack_paths', 'Computed attack paths', 'path_nodes, path_edges, total_risk, complexity, mitre_techniques'],
      ['risk_scores', 'Dynamic risk assessments', 'overall_risk, vulnerability_risk, threat_risk, behaviour_risk, exposure_risk'],
      ['dashboard_metrics', 'Pre-aggregated metrics', 'metric_type, metric_value, time_bucket, dimensions'],
    ],
    [18, 27, 55]
  ),
  spacer(200),
  heading('5.1 Assets Table', HeadingLevel.HEADING_2),
  para('Stores critical infrastructure assets including servers, workstations, network devices, OT systems, databases, cloud instances, containers, and IoT devices.'),
  para('Asset types: server, workstation, network_device, ot_system, database, cloud_instance, container, iot_device', { italic: true, color: '666666' }),
  para('Environments: IT, OT, hybrid, cloud', { italic: true, color: '666666' }),
  para('Criticality is scored 1-5, with risk scores dynamically calculated. Assets can be flagged as compromised or isolated.'),
  spacer(200),
  heading('5.2 Incidents Table', HeadingLevel.HEADING_2),
  para('Stores security incidents with full lifecycle management, MITRE ATT&CK mapping, and performance metrics.'),
  para('Severity levels: critical, high, medium, low, info', { italic: true, color: '666666' }),
  para('Status values: open, investigating, contained, resolved, false_positive', { italic: true, color: '666666' }),
  para('Categories: malware, ransomware, apt, insider_threat, data_exfiltration, lateral_movement, privilege_escalation, denial_of_service, phishing, zero_day, other', { italic: true, color: '666666' }),
  para('Each incident tracks TTD (Time to Detect) and TTR (Time to Respond) in seconds, along with IOCs, timeline, response actions, and impact assessment as JSONB fields.'),
  spacer(200),
  heading('5.3 UEBA Events Table', HeadingLevel.HEADING_2),
  para('Stores behavioural anomaly events detected by various ML algorithms.'),
  para('Anomaly types: login_anomaly, data_access_anomaly, network_anomaly, process_anomaly, privilege_escalation, lateral_movement, data_exfiltration, beaconing, dns_tunneling, ransomware_behavior, insider_threat', { italic: true, color: '666666' }),
  para('Algorithms: isolation_forest, autoencoder, lof, dbscan, statistical, lstm, ensemble', { italic: true, color: '666666' }),
  para('Each event records baseline vs. observed values, a deviation score, ML features, and can be linked to related incidents.'),
  spacer(200),
  heading('5.4 SOAR Tables', HeadingLevel.HEADING_2),
  para('SOAR Playbooks define automated response workflows with trigger conditions (JSONB), multi-step actions (JSONB), and configurable approval thresholds.'),
  para('SOAR Actions record executed responses with full audit trails (JSONB), rollback capability, confidence scores, and execution metadata.'),
  para('Action types: block_ip, disable_account, kill_process, isolate_endpoint, create_ticket, snapshot_vm, notify_soc, quarantine_file, revoke_credential, update_firewall, collect_forensics, other', { italic: true, color: '666666' }),
  spacer(200),
  heading('5.5 RLS Policies', HeadingLevel.HEADING_2),
  para('Row-Level Security is enabled on all tables. The platform uses a single-tenant demo model with policies allowing both anon and authenticated roles to perform CRUD operations. For production deployment, these policies should be tightened to enforce ownership checks using auth.uid().'),
);

// ═══════════════════════════════════════════════════════════════════════
// 6. MODULE SPECIFICATIONS
// ═══════════════════════════════════════════════════════════════════════

children.push(
  pageBreak(),
  heading('6. Module Specifications', HeadingLevel.HEADING_1),
  divider(),
  para('This section provides detailed technical specifications for each module in the SentinelX AI platform.'),
);

const moduleSpecs = [
  {
    title: '6.1 Dashboard',
    route: '/',
    access: 'All authenticated users',
    desc: 'The main dashboard provides a unified security operations overview with real-time metrics, recent activity, and quick navigation.',
    features: [
      'KPI cards: Open incidents, critical alerts, Mean Time to Detect, Mean Time to Respond, protected assets',
      'Recent incidents feed with severity badges, MITRE technique tags, and relative timestamps',
      'High-risk assets list sorted by risk score with compromise status indicators',
      'Quick action buttons for SOC Console, UEBA, SOAR, and AI Copilot',
      'Live system status indicator with AI module status badge',
      'Data fetched from Supabase with real-time updates',
    ],
  },
  {
    title: '6.2 SOC Console',
    route: '/soc',
    access: 'All authenticated users',
    desc: 'The SOC console is the primary workspace for security analysts, providing a real-time incident queue with triage capabilities.',
    features: [
      'Filterable incident queue by severity (all, critical, high, medium, low)',
      'Incident detail panel with MITRE technique mapping and IOCs',
      'SOAR action tracking for executed automated responses',
      'Status management (open, investigating, contained, resolved, false_positive)',
      'Real-time data from Supabase with toast notifications',
      'Severity color coding with visual indicators',
    ],
  },
  {
    title: '6.3 MITRE ATT&CK Matrix',
    route: '/mitre',
    access: 'All authenticated users',
    desc: 'Interactive MITRE ATT&CK framework matrix showing technique-level detection coverage across all 14 tactics.',
    features: [
      'All 14 MITRE ATT&CK tactics from Reconnaissance through Impact',
      'Per-technique detection counts and coverage status',
      'Detail dialog with full description, detection methods, and mitigations',
      'Visual indicators for detected vs. undetected techniques',
      'Kill-chain stage mapping for each technique',
    ],
  },
  {
    title: '6.4 Asset Inventory',
    route: '/assets',
    access: 'Cyber Analyst only',
    desc: 'Complete IT/OT asset registry with criticality scoring, compromise tracking, and isolation management.',
    features: [
      'Asset listing with type, environment, criticality, and risk score',
      'Compromise and isolation status tracking',
      'Vulnerability count per asset',
      'Filtering by environment (IT, OT, hybrid, cloud) and type',
      'Asset detail view with metadata',
    ],
  },
  {
    title: '6.5 Incident Management',
    route: '/incidents',
    access: 'Cyber Analyst only',
    desc: 'Full incident lifecycle management with MITRE mapping, confidence scoring, and timeline reconstruction.',
    features: [
      'Incident listing with severity, status, and category filters',
      'Detailed incident view with MITRE tactics and techniques',
      'Confidence scoring for AI-assisted analysis',
      'Timeline reconstruction with kill-chain stages',
      'IOC management and response action tracking',
      'TTD and TTR metrics per incident',
    ],
  },
  {
    title: '6.6 Threat Intelligence',
    route: '/threat-intel',
    access: 'Cyber Analyst only',
    desc: 'Aggregated threat intelligence from multiple feeds with IOC management and threat actor tracking.',
    features: [
      'IOC types: IP, domain, URL, MD5 hash, SHA256 hash, email, CVE, threat actor, campaign',
      'Sources: MITRE, CISA, CERT-In, AlienVault, AbuseIPDB, GreyNoise, VirusTotal, MISP, custom',
      'Confidence scoring per IOC',
      'Threat actor and campaign association',
      'Malware family tagging',
      'First/last seen tracking',
    ],
  },
  {
    title: '6.7 UEBA (Behavioural Analytics)',
    route: '/ueba',
    access: 'Cyber Analyst only',
    desc: 'User & Entity Behaviour Analytics with ML-powered anomaly detection across multiple algorithms.',
    features: [
      'Anomaly types: login, data access, network, process, privilege escalation, lateral movement, data exfiltration, beaconing, DNS tunnelling, ransomware, insider threat',
      'ML algorithms: Isolation Forest, Autoencoder, LOF, DBSCAN, Statistical, LSTM, Ensemble',
      'Deviation scoring with baseline vs. observed values',
      'Entity types: user, device, network, application, service',
      'Incident correlation linking anomalies to security incidents',
      'Confirmation and false positive tracking',
    ],
  },
  {
    title: '6.8 SOAR (Automated Response)',
    route: '/soar',
    access: 'Cyber Analyst only',
    desc: 'Security Orchestration, Automation & Response with playbook-driven automated response and approval workflows.',
    features: [
      'Playbook library for malware, ransomware, APT, insider threat, phishing, and more',
      'JSON-defined trigger conditions for automatic activation',
      'Configurable approval thresholds (low, medium, high, critical)',
      'Action types: block IP, disable account, kill process, isolate endpoint, create ticket, snapshot VM, quarantine file, revoke credential, update firewall, collect forensics',
      'Full audit trail with rollback support',
      'Success metrics: execution count, success rate, average execution time',
    ],
  },
  {
    title: '6.9 AI Copilot',
    route: '/copilot',
    access: 'All authenticated users',
    desc: 'Conversational AI assistant powered by Google Gemini with live database context for natural-language security queries.',
    features: [
      'Natural language queries about security posture',
      'Live database context (incidents, assets, threats)',
      'Real-time response streaming',
      'Source citations with MITRE technique references',
      'Confidence scoring per response',
      'Automatic issue detection and highlighting',
      'Thumbs up/down feedback mechanism',
      'Copy and refresh response management',
    ],
  },
  {
    title: '6.10 Risk Dashboard',
    route: '/risk',
    access: 'All authenticated users',
    desc: 'Multi-factor dynamic risk scoring across assets, users, networks, and the organisation.',
    features: [
      'Overall risk score (0-100) per entity',
      'Risk dimensions: vulnerability, threat, behaviour, exposure, configuration',
      'Risk trend tracking (increasing, decreasing, stable)',
      'Previous score comparison',
      'Risk factors as JSONB for detailed analysis',
      'Entity types: asset, user, network, organization',
    ],
  },
  {
    title: '6.11 Attack Graph',
    route: '/attack-graph',
    access: 'Cyber Analyst only',
    desc: 'Visual attack path analysis showing lateral movement and privilege escalation routes between assets.',
    features: [
      'Attack path nodes and edges as JSONB',
      'Path types: lateral movement, privilege escalation, credential theft, data exfiltration, persistence',
      'Total risk scoring per path',
      'Complexity rating (1-10)',
      'Exploited vulnerabilities and MITRE techniques per path',
      'Active path tracking',
    ],
  },
  {
    title: '6.12 APT Attribution',
    route: '/apt-attribution',
    access: 'Cyber Analyst only',
    desc: 'Advanced Persistent Threat actor identification and campaign correlation with confidence scoring.',
    features: [
      'Threat actor identification',
      'Campaign correlation and tracking',
      'Confidence scoring for attribution',
      'Historical pattern matching',
      'IOC-based attribution',
    ],
  },
  {
    title: '6.13 Vulnerability Prioritisation',
    route: '/vulnerability',
    access: 'Cyber Analyst only',
    desc: 'AI-driven vulnerability prioritisation based on exploitability, exposure, and asset criticality.',
    features: [
      'Exploitability assessment',
      'Exposure analysis',
      'Asset criticality weighting',
      'AI-driven priority scoring',
      'CVE tracking',
    ],
  },
  {
    title: '6.14 Digital Twin',
    route: '/digital-twin',
    access: 'Cyber Analyst only',
    desc: 'Digital replica of the infrastructure for attack simulation and what-if analysis.',
    features: [
      'Infrastructure simulation',
      'What-if attack scenarios',
      'Predictive impact analysis',
      'Attack path simulation',
      'Defensive posture testing',
    ],
  },
  {
    title: '6.15 Correlation Engine',
    route: '/correlation',
    access: 'Cyber Analyst only',
    desc: 'Cross-source event correlation to identify complex, multi-stage attack patterns.',
    features: [
      'Multi-source event correlation',
      'Multi-stage attack pattern detection',
      'Temporal correlation',
      'Cross-entity relationship mapping',
    ],
  },
  {
    title: '6.16 Attack Progression',
    route: '/progression',
    access: 'Cyber Analyst only',
    desc: 'Predictive attack progression modelling showing likely next attacker moves.',
    features: [
      'Predictive next-step analysis',
      'Kill-chain progression modelling',
      'Probability scoring for attack paths',
      'Proactive defence recommendations',
    ],
  },
  {
    title: '6.17 AI Agents',
    route: '/agents',
    access: 'Cyber Analyst only',
    desc: 'Autonomous AI agents for continuous monitoring, investigation, and response orchestration.',
    features: [
      'Autonomous monitoring agents',
      'Automated investigation workflows',
      'Response orchestration',
      'Agent status tracking',
    ],
  },
  {
    title: '6.18 Timeline',
    route: '/timeline',
    access: 'All authenticated users',
    desc: 'Chronological incident reconstruction with kill-chain stage visualisation.',
    features: [
      'Chronological event display',
      'Kill-chain stage mapping',
      'Incident timeline reconstruction',
      'Relative and absolute timestamps',
    ],
  },
  {
    title: '6.19 Executive View',
    route: '/executive',
    access: 'All authenticated users',
    desc: 'High-level metrics and trends for leadership reporting.',
    features: [
      'Executive-level KPIs',
      'Trend analysis',
      'Risk summary',
      'Compliance posture overview',
    ],
  },
  {
    title: '6.20 Demo & Testing',
    route: '/demo',
    access: 'All authenticated users',
    desc: 'Built-in data seeding and scenario simulation for testing and demonstrations.',
    features: [
      'Data seeding tools',
      'Scenario simulation',
      'Test data generation',
      'Platform demonstration utilities',
    ],
  },
];

for (const spec of moduleSpecs) {
  children.push(
    heading(spec.title, HeadingLevel.HEADING_2),
    makeTable(
      ['Property', 'Value'],
      [
        ['Route', spec.route],
        ['Access', spec.access],
      ],
      [25, 75]
    ),
    spacer(100),
    para(spec.desc),
    spacer(80),
    para('Key Features:', { bold: true, color: BRAND_COLOR }),
    ...spec.features.map((f) => bullet(f)),
    spacer(150),
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 7. AUTHENTICATION & RBAC
// ═══════════════════════════════════════════════════════════════════════

children.push(
  pageBreak(),
  heading('7. Authentication & Role-Based Access Control', HeadingLevel.HEADING_1),
  divider(),
  para('SentinelX AI uses Supabase Auth with email/password authentication and role-based access control (RBAC).'),
  spacer(100),
  heading('7.1 Roles', HeadingLevel.HEADING_2),
  makeTable(
    ['Role', 'Access Level', 'Description'],
    [
      ['Cyber Analyst', 'Full Access', 'Access to all modules including incidents, threat intel, assets, SOAR, UEBA, AI analysis, and all advanced AI features.'],
      ['Observer', 'Read-Only', 'Limited to dashboard, SOC console (view), MITRE matrix, timeline, risk dashboard, AI copilot, settings, and profile.'],
    ],
    [20, 20, 60]
  ),
  spacer(200),
  heading('7.2 Authentication Flow', HeadingLevel.HEADING_2),
  bullet('Users sign up with email and password via Supabase Auth on the /auth/signup page.'),
  bullet('A user_profiles table stores role assignments (analyst or observer) linked to the Supabase auth user.'),
  bullet('On login, the AuthContext provider loads the user profile and determines the role.'),
  bullet('The app layout enforces route protection — analyst-only pages redirect observers to the dashboard.'),
  bullet('The sidebar dynamically filters navigation items based on the user role.'),
  bullet('Session management is handled by Supabase with automatic token refresh.'),
  spacer(200),
  heading('7.3 Protected Routes', HeadingLevel.HEADING_2),
  para('The following routes require the Cyber Analyst role. Observers are redirected to the dashboard:'),
  bullet('/incidents'),
  bullet('/threat-intel'),
  bullet('/assets'),
  bullet('/soar'),
  bullet('/agents'),
  bullet('/ai-analysis'),
  bullet('/ueba'),
  bullet('/correlation'),
  bullet('/apt-attribution'),
  bullet('/vulnerability'),
  bullet('/digital-twin'),
  bullet('/progression'),
  bullet('/attack-graph'),
);

// ═══════════════════════════════════════════════════════════════════════
// 8. AI COPILOT IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════

children.push(
  pageBreak(),
  heading('8. AI Copilot Implementation', HeadingLevel.HEADING_1),
  divider(),
  para("The AI Copilot is the platform's conversational AI interface, powered by Google Gemini via a Supabase Edge Function running on the Deno runtime."),
  spacer(100),
  heading('8.1 Architecture', HeadingLevel.HEADING_2),
  bulletBold('Step 1:', 'The user sends a message via the chat interface at /copilot.'),
  bulletBold('Step 2:', 'The frontend sends the message plus live database context (incident count, asset count, threat count) to the ai-copilot edge function.'),
  bulletBold('Step 3:', 'The edge function (Deno runtime) forwards the conversation to Google Gemini with a security-focused system prompt.'),
  bulletBold('Step 4:', 'Gemini returns analysis, recommendations, and MITRE technique references.'),
  bulletBold('Step 5:', 'The response is streamed back to the user with confidence scores and source citations.'),
  spacer(200),
  heading('8.2 System Prompt Capabilities', HeadingLevel.HEADING_2),
  para('The AI Copilot system prompt enables the following capabilities:'),
  bulletBold('General Knowledge:', 'Answer questions about science, technology, history, programming, cybersecurity, and current events.'),
  bulletBold('Security Operations:', 'Access live security database for incident analysis, asset risk assessments, threat intelligence interpretation, and incident response guidance.'),
  bulletBold('MITRE ATT&CK:', 'Explain techniques, map incidents to tactics, and recommend detections.'),
  bulletBold('Vulnerability Prioritization:', 'Provide guidance on vulnerability prioritisation based on context.'),
  bulletBold('Database Queries:', 'Analyse and explain database query results in a clear, actionable way.'),
  spacer(200),
  heading('8.3 Edge Function Details', HeadingLevel.HEADING_2),
  para('The ai-copilot edge function is deployed via the Supabase MCP deploy_edge_function tool. It runs on the Deno runtime and uses jsr: imports for Supabase functions. The function includes strict CORS headers on all responses (preflight, success, and error) to ensure compatibility with Supabase clients.'),
  para('File location: supabase/functions/ai-copilot/index.ts', { italic: true, color: '666666' }),
);

// ═══════════════════════════════════════════════════════════════════════
// 9. SECURITY MODEL
// ═══════════════════════════════════════════════════════════════════════

children.push(
  pageBreak(),
  heading('9. Security Model', HeadingLevel.HEADING_1),
  divider(),
  para('SentinelX AI implements security at multiple layers:'),
  spacer(100),
  heading('9.1 Row-Level Security (RLS)', HeadingLevel.HEADING_2),
  para('Row-Level Security is enabled on all 10+ database tables. The current demo configuration allows both anon and authenticated roles to perform CRUD operations. For production deployment, policies should be tightened to enforce ownership checks using auth.uid() and scope access to TO authenticated.'),
  spacer(100),
  heading('9.2 Authentication', HeadingLevel.HEADING_2),
  bullet('Email/password authentication via Supabase Auth'),
  bullet('Session management with automatic token refresh'),
  bullet('No magic links or social providers (by design)'),
  bullet('Email confirmation is disabled for demo purposes'),
  spacer(100),
  heading('9.3 Role-Based Access Control', HeadingLevel.HEADING_2),
  bullet('Analyst vs. Observer roles stored in user_profiles table'),
  bullet('Route-level enforcement in the app layout'),
  bullet('Sidebar navigation dynamically filtered by role'),
  bullet('Analyst-only pages redirect observers to the dashboard'),
  spacer(100),
  heading('9.4 Edge Function Security', HeadingLevel.HEADING_2),
  bullet('Strict CORS headers on all responses'),
  bullet('Access-Control-Allow-Origin: * (configurable for production)'),
  bullet('Allowed methods: GET, POST, PUT, DELETE, OPTIONS'),
  bullet('Allowed headers: Content-Type, Authorization, X-Client-Info, Apikey'),
  spacer(100),
  heading('9.5 Input Validation', HeadingLevel.HEADING_2),
  bullet('Zod schemas for form validation'),
  bullet('React Hook Form integration for type-safe forms'),
  bullet('TypeScript compile-time type checking across the application'),
);

// ═══════════════════════════════════════════════════════════════════════
// 10. TECHNOLOGY STACK
// ═══════════════════════════════════════════════════════════════════════

children.push(
  pageBreak(),
  heading('10. Technology Stack', HeadingLevel.HEADING_1),
  divider(),
  heading('10.1 Frontend', HeadingLevel.HEADING_2),
  makeTable(
    ['Technology', 'Version', 'Purpose'],
    [
      ['Next.js', '13.5', 'React framework with App Router'],
      ['React', '18.2', 'UI library for component-based rendering'],
      ['TypeScript', '5.2', 'Type safety across the application'],
      ['Tailwind CSS', '3.3', 'Utility-first CSS framework'],
      ['shadcn/ui + Radix UI', 'Latest', 'Accessible, customisable component library'],
      ['Framer Motion', '12.x', 'Animations and micro-interactions'],
      ['Recharts', '2.12', 'Data visualisation and charting'],
      ['Lucide React', '0.446', 'Consistent icon system'],
      ['React Hook Form + Zod', 'Latest', 'Type-safe form handling and validation'],
      ['Sonner', '1.5', 'Toast notifications'],
      ['date-fns', '3.6', 'Date formatting and manipulation'],
    ],
    [25, 15, 60]
  ),
  spacer(200),
  heading('10.2 Backend', HeadingLevel.HEADING_2),
  makeTable(
    ['Technology', 'Purpose'],
    [
      ['Supabase', 'PostgreSQL database, authentication, and real-time subscriptions'],
      ['Supabase Edge Functions', 'Deno-runtime serverless functions for AI and backend logic'],
      ['Google Gemini AI', 'Large Language Model powering the AI Copilot'],
      ['Row-Level Security', 'Database-level access control on all tables'],
    ],
    [30, 70]
  ),
  spacer(200),
  heading('10.3 Infrastructure', HeadingLevel.HEADING_2),
  makeTable(
    ['Technology', 'Purpose'],
    [
      ['Netlify', 'Deployment and hosting with continuous deployment'],
      ['Supabase Cloud', 'Managed PostgreSQL, Auth, and Edge Functions'],
    ],
    [30, 70]
  ),
);

// ═══════════════════════════════════════════════════════════════════════
// 11. PROJECT STRUCTURE
// ═══════════════════════════════════════════════════════════════════════

children.push(
  pageBreak(),
  heading('11. Project Structure', HeadingLevel.HEADING_1),
  divider(),
  para('The project follows a standard Next.js App Router structure with the following layout:'),
  spacer(100),
  heading('11.1 Directory Layout', HeadingLevel.HEADING_2),
  makeTable(
    ['Path', 'Description'],
    [
      ['app/(app)/', 'Authenticated app routes (dashboard, SOC, incidents, etc.)'],
      ['app/(app)/layout.tsx', 'App layout with auth guard and role enforcement'],
      ['app/auth/', 'Login and signup pages'],
      ['app/api/', 'API routes (dashboard, docs generation)'],
      ['app/globals.css', 'Global styles and Tailwind CSS configuration'],
      ['app/layout.tsx', 'Root layout with providers'],
      ['components/layout/', 'App header, sidebar, and main layout components'],
      ['components/ui/', 'shadcn/ui component library (40+ components)'],
      ['components/providers.tsx', 'App providers wrapper'],
      ['hooks/', 'Custom React hooks (use-toast)'],
      ['lib/', 'Utilities, types, Supabase client, auth context'],
      ['supabase/functions/', 'Edge functions (ai-copilot)'],
      ['supabase/migrations/', 'SQL migrations (schema, roles, notifications)'],
    ],
    [30, 70]
  ),
  spacer(200),
  heading('11.2 Key Files', HeadingLevel.HEADING_2),
  bulletBold('lib/supabase.ts', 'Initialises the Supabase client with environment variables.'),
  bulletBold('lib/auth-context.tsx', 'Auth context provider with user state, loading state, and isAnalyst flag.'),
  bulletBold('lib/types.ts', 'TypeScript type definitions for the application.'),
  bulletBold('lib/utils.ts', 'Utility functions including cn() for class merging.'),
  bulletBold('components/layout/app-sidebar.tsx', 'Navigation sidebar with role-based filtering.'),
  bulletBold('components/layout/main-layout.tsx', 'Main layout wrapper combining header, sidebar, and content.'),
  bulletBold('supabase/functions/ai-copilot/index.ts', 'Gemini-powered AI Copilot edge function.'),
);

// ═══════════════════════════════════════════════════════════════════════
// 12. DEPLOYMENT GUIDE
// ═══════════════════════════════════════════════════════════════════════

children.push(
  pageBreak(),
  heading('12. Deployment Guide', HeadingLevel.HEADING_1),
  divider(),
  heading('12.1 Prerequisites', HeadingLevel.HEADING_2),
  bullet('Node.js 18.17 or higher'),
  bullet('npm or pnpm package manager'),
  bullet('A Supabase project with URL and anon key'),
  bullet('Google Gemini API key (for AI Copilot)'),
  spacer(200),
  heading('12.2 Local Development', HeadingLevel.HEADING_2),
  para('1. Clone the repository and install dependencies:'),
  new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: '   git clone <repo-url> && cd sentinelx-ai && npm install', size: 20, font: 'Consolas', color: '333333' })] }),
  para('2. Set up environment variables in .env:'),
  new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: '   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url', size: 20, font: 'Consolas', color: '333333' })] }),
  new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: '   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key', size: 20, font: 'Consolas', color: '333333' })] }),
  para('3. Run database migrations via Supabase Dashboard SQL Editor in order:'),
  bullet('001_sentinelx_schema.sql (core schema + RLS)'),
  bullet('002_user_profiles_with_roles.sql (auth roles)'),
  bullet('003_notifications_table.sql (notifications)'),
  para('4. Start the development server:'),
  new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: '   npm run dev', size: 20, font: 'Consolas', color: '333333' })] }),
  para('5. Visit http://localhost:3000 and sign up or log in.'),
  spacer(200),
  heading('12.3 Production Deployment', HeadingLevel.HEADING_2),
  bullet('Connect the repository to Netlify for automatic deployments.'),
  bullet('Set environment variables in the Netlify dashboard.'),
  bullet('Deploy the ai-copilot edge function via Supabase MCP.'),
  bullet('Configure the Gemini API key as an edge function secret.'),
  bullet('Run npm run build to verify the production build succeeds.'),
);

// ═══════════════════════════════════════════════════════════════════════
// 13. ROADMAP
// ═══════════════════════════════════════════════════════════════════════

children.push(
  pageBreak(),
  heading('13. Roadmap', HeadingLevel.HEADING_1),
  divider(),
  heading('13.1 Completed', HeadingLevel.HEADING_2),
  makeTable(
    ['Feature', 'Status'],
    [
      ['Core SOC dashboard and incident management', 'Completed'],
      ['MITRE ATT&CK matrix integration', 'Completed'],
      ['UEBA with multiple ML algorithms', 'Completed'],
      ['SOAR playbook automation', 'Completed'],
      ['AI Copilot with Gemini integration', 'Completed'],
      ['Role-based access control', 'Completed'],
      ['Attack graph and path analysis', 'Completed'],
      ['APT attribution and threat intel', 'Completed'],
      ['Digital twin simulation', 'Completed'],
      ['Correlation engine', 'Completed'],
      ['Attack progression modelling', 'Completed'],
    ],
    [70, 30]
  ),
  spacer(200),
  heading('13.2 Planned', HeadingLevel.HEADING_2),
  makeTable(
    ['Feature', 'Status'],
    [
      ['Real-time WebSocket alerting', 'Planned'],
      ['Multi-tenant organisation support', 'Planned'],
      ['API rate limiting and quotas', 'Planned'],
      ['Mobile-responsive SOC console', 'Planned'],
      ['SSO / SAML integration', 'Planned'],
      ['Compliance reporting (SOC 2, ISO 27001, NIST)', 'Planned'],
    ],
    [70, 30]
  ),
);

// ═══════════════════════════════════════════════════════════════════════
// 14. CONCLUSION
// ═══════════════════════════════════════════════════════════════════════

children.push(
  pageBreak(),
  heading('14. Conclusion', HeadingLevel.HEADING_1),
  divider(),
  para('SentinelX AI represents a comprehensive approach to modern cyber resilience — combining traditional SOC operations with AI-powered analysis, behavioural analytics, and automated response. By unifying these capabilities into a single platform with role-based access, the platform enables security teams to detect threats faster, respond more effectively, and make informed decisions with AI-assisted insights.'),
  spacer(100),
  para('The serverless architecture using Supabase and Deno Edge Functions provides a scalable, cost-effective foundation, while the Next.js frontend delivers a responsive, accessible user experience. The integration of Google Gemini for the AI Copilot demonstrates how large language models can be leveraged for practical security operations use cases.'),
  spacer(100),
  para('As the threat landscape continues to evolve, platforms like SentinelX AI will be essential for organisations seeking to maintain robust cyber resilience through intelligent, automated, and AI-assisted security operations.'),
  spacer(400),
  divider(),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 }, children: [new TextRun({ text: 'SentinelX AI — Built with security, powered by AI.', italics: true, size: 24, color: ACCENT_COLOR, font: 'Calibri' })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100 }, children: [new TextRun({ text: 'Document generated on ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), size: 20, color: '999999', font: 'Calibri' })] }),
);

// ═══════════════════════════════════════════════════════════════════════
// BUILD DOCUMENT
// ═══════════════════════════════════════════════════════════════════════

const doc = new Document({
  creator: 'SentinelX AI',
  title: 'SentinelX AI — Project Documentation',
  description: 'Comprehensive project documentation for the SentinelX AI Cyber Resilience Platform',
  styles: {
    default: {
      document: {
        run: { font: 'Calibri', size: 22 },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: 'SentinelX AI — Project Documentation', size: 18, color: '999999', font: 'Calibri' }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
              children: [
                new TextRun({ text: 'Page ', size: 18, color: '999999', font: 'Calibri' }),
                new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '999999', font: 'Calibri' }),
                new TextRun({ text: ' of ', size: 18, color: '999999', font: 'Calibri' }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: '999999', font: 'Calibri' }),
              ],
            }),
          ],
        }),
      },
      children,
    },
  ],
});

async function main() {
  const buffer = await Packer.toBuffer(doc);
  const outPath = path.join(process.cwd(), 'public', 'SentinelX-AI-Documentation.docx');
  fs.writeFileSync(outPath, buffer);
  console.log('DOCX generated successfully!');
  console.log('Output:', outPath);
  console.log('Size:', buffer.length, 'bytes');
  console.log('Children count:', children.length);
}

main().catch(err => { console.error('Error:', err); process.exit(1); });
