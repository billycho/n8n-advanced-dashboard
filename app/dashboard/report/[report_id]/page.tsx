"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useReport } from "@/features/reports/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft, Calendar, User, FileText, AlertCircle,
  CheckCircle2, AlertTriangle, Hash, Code, Database, Info
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function ReportDetailsPage({ params }: { params: Promise<{ report_id: string }> }) {
  const { report_id } = use(params);
  const router = useRouter();
  const { data: report, isLoading } = useReport(report_id);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Success</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "warning":
        return <Badge variant="secondary" className="bg-yellow-500 text-white hover:bg-yellow-600">Warning</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Reports
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Report not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2 -ml-2 mb-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Reports
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Report Details</h1>
            {getStatusBadge(report.report_status)}
          </div>
          <p className="text-muted-foreground flex items-center gap-2">
            <User className="h-4 w-4" />
            {report.agent ? (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">AI Agent</Badge>
            ) : report.workflow ? (
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Workflow</Badge>
            ) : null}
            <span className="font-semibold text-foreground ml-1">
              {report.agent ? report.agent.name : report.workflow?.name}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-muted text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Generated on:</span>
          <span className="font-medium">{format(new Date(report.report_date), "PPpp")}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-md border-primary/10">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Report Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed whitespace-pre-wrap">
                  {report.report_summary}
                </p>
              </div>
            </CardContent>
          </Card>

          {report.error_details && (
            <Card className="shadow-md border-red-500/20 bg-red-50/5">
              <CardHeader className="bg-red-500/10">
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" /> Error Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="p-4 rounded-lg bg-red-500/5 border border-red-200 dark:border-red-900 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                  {report.error_details}
                </div>
              </CardContent>
            </Card>
          )}

          {report.metadata && Object.keys(report.metadata).length > 0 && (
            <Card className="shadow-md border-primary/10">
              <CardHeader className="border-b bg-muted/20">
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" /> Metadata
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative group">
                  <pre className="p-4 rounded-lg bg-secondary/50 border border-secondary font-mono text-xs overflow-x-auto max-h-[400px]">
                    {JSON.stringify(report.metadata, null, 2)}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(report.metadata, null, 2));
                      toast.success("Metadata copied to clipboard");
                    }}
                  >
                    <Code className="h-3 w-3 mr-2" /> Copy JSON
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="shadow-md border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg">Execution Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3 w-3" /> Report ID
                </Label>
                <p className="font-mono text-[10px] break-all p-2 bg-muted rounded border border-muted">
                  {report._id}
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" /> Target
                </Label>
                {report.agent ? (
                  <div
                    className="p-3 rounded-lg bg-primary/5 border border-primary/10 cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => router.push(`/dashboard/ai-agents/${report.agent?._id}`)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold">{report.agent.name}</p>
                      <Badge variant="outline" className="text-[10px] h-5 bg-blue-50 text-blue-700 border-blue-200">AI Agent</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">{report.agent.category} • {report.agent.environment}</p>
                  </div>
                ) : report.workflow ? (
                  <div
                    className="p-3 rounded-lg bg-primary/5 border border-primary/10 cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => router.push(`/dashboard/workflows/${report.workflow?._id}`)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold">{report.workflow.name}</p>
                      <Badge variant="outline" className="text-[10px] h-5 bg-purple-50 text-purple-700 border-purple-200">Workflow</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">Workflow</p>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="font-semibold text-muted-foreground">Unknown Target</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-muted">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(report.report_status)}
                    <span className="text-sm font-medium capitalize">{report.report_status}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" /> Helper
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This report was automatically generated by the Agent Analyzer from n8n. If the status is "Failed", check the Error Details card for more information.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
