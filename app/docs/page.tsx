'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Download,
  Shield,
  Brain,
  Database,
  Zap,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

const docSections = [
  'Project Overview & Objectives',
  'Feature Overview (20+ modules)',
  'System Architecture',
  'Database Schema (10 tables with RLS)',
  'Module Specifications (detailed per-module)',
  'Authentication & Role-Based Access Control',
  'AI Copilot Implementation',
  'Security Model',
  'Technology Stack',
  'Project Structure',
  'Deployment Guide',
  'Roadmap',
];

export default function DocsPage() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch('/SentinelX-AI-Documentation.docx');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'SentinelX-AI-Documentation.docx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <Shield className="h-7 w-7 text-primary" />
              <div className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-success animate-pulse" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight">SentinelX</span>
              <span className="ml-1 text-xs text-primary">AI</span>
            </div>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-3 text-4xl font-bold tracking-tight">
            Project Documentation
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Download the comprehensive SentinelX AI project documentation as a Word document.
            Includes full architecture, database schema, module specs, and deployment guide.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Download Card */}
          <Card className="md:col-span-2 card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                SentinelX AI — Full Documentation
              </CardTitle>
              <CardDescription>
                Complete technical documentation in .docx format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Database className="h-3 w-3" /> 10 Tables Documented
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Brain className="h-3 w-3" /> AI Copilot Details
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Zap className="h-3 w-3" /> 20+ Modules
                </Badge>
                <Badge variant="secondary">14 Sections</Badge>
                <Badge variant="secondary">~40 Pages</Badge>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <h4 className="mb-3 text-sm font-semibold">Document Contents:</h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {docSections.map((section, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                      <span className="text-muted-foreground">{section}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleDownload}
                disabled={downloading}
                size="lg"
                className="w-full gap-2"
              >
                {downloading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Preparing Download...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    Download Documentation (.docx)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-base">About This Document</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                This Word document provides a detailed technical breakdown of the
                entire SentinelX AI platform — from architecture and database design
                to individual module specifications and deployment instructions.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Format: Microsoft Word (.docx)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Styled with branded headers & tables</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Page numbers & footer</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Cover page & table of contents</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
