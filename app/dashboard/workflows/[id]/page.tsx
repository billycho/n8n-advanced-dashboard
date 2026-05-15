"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkflow, useDeleteWorkflow } from "@/features/workflows/hooks";
import { UpdateWorkflowDialog } from "@/features/workflows/components/update-workflow-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft, Pencil, Trash2, Calendar, Globe, Cpu, Hash, Link2, Box,
  Play, Pause, Settings, Plus, AlertCircle, Clock, Database, Activity,
  Zap
} from "lucide-react";

export default function WorkflowDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: workflow, isLoading } = useWorkflow(id);
  const { mutate: deleteWorkflow } = useDeleteWorkflow();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this Workflow?")) {
      deleteWorkflow(id, {
        onSuccess: () => {
          router.push("/dashboard/workflows");
        },
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to List
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Workflow not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2 -ml-2 mb-2 text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to Workflows
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold tracking-tight">{workflow.name}</h1>
            <Badge variant={workflow.active ? "default" : "destructive"}>
              {workflow.active ? "Active" : "Inactive"}
            </Badge>
            {workflow.environment && (
              <Badge variant="secondary" className="capitalize">
                {workflow.environment}
              </Badge>
            )}
          </div>
          <p className="text-lg text-muted-foreground">{workflow.description || "No description provided."}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="lg" className="gap-2" onClick={() => setIsUpdateDialogOpen(true)}>
            <Pencil className="h-4 w-4" /> Update
          </Button>
          <Button variant="destructive" size="lg" className="gap-2" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Details */}
        <Card className="md:col-span-2 shadow-md border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" /> Configuration
            </CardTitle>
            <CardDescription>Core settings and identity of your workflow</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-muted">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3 w-3" /> Workflow ID
                </Label>
                <p className="font-mono text-sm break-all">{workflow._id}</p>
              </div>

              <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-muted">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Zap className="h-3 w-3" /> Trigger Type
                </Label>
                <p className="font-semibold">{workflow.triggerType || "Not specified"}</p>
              </div>

              <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-muted">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Globe className="h-3 w-3" /> Slug
                </Label>
                <p className="font-medium">{workflow.slug || "Not specified"}</p>
              </div>

              <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-muted">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Category
                </Label>
                <p className="font-medium">
                  {workflow.category || "General"}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3 w-3" /> n8n Workflow ID
                </Label>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 font-mono text-sm border border-secondary">
                  {workflow.workflow_id || "No external workflow assigned"}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Link2 className="h-3 w-3" /> Webhook URL
                </Label>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 font-mono text-sm border border-secondary">
                  {workflow.webhook_url || "No webhook URL configured"}
                </div>
              </div>

              {workflow.form_url && (
                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <Label className="text-xs uppercase tracking-wider text-primary flex items-center gap-1 font-bold">
                    <Database className="h-3 w-3" /> Form URL
                  </Label>
                  <a
                    href={workflow.form_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 p-3 rounded-lg bg-primary/5 text-primary font-medium border border-primary/20 hover:bg-primary/10 transition-colors group"
                  >
                    <span className="truncate">{workflow.form_url}</span>
                    <Link2 className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Metadata */}
        <div className="space-y-6">
          <Card className="shadow-md border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-muted">
                <span className="text-sm text-muted-foreground">Environment</span>
                <span className="text-sm font-medium capitalize">{workflow.environment || "Not set"}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-muted">
                <span className="text-sm text-muted-foreground">Created At</span>
                <span className="text-sm font-medium">  {workflow.createdAt ? new Date(workflow.createdAt).toLocaleString() : "Unknown"}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Updated At</span>
                <span className="text-sm font-medium">  {workflow.updatedAt ? new Date(workflow.updatedAt).toLocaleString() : "Unknown"}</span>
              </div>
            </CardContent>
          </Card>

          <Card className={`shadow-md border-primary/20 ${workflow.active ? "bg-green-500/5" : "bg-red-500/5"}`}>
            <CardHeader>
              <CardTitle className="text-lg">Operational Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`flex items-center gap-2 text-sm font-medium ${workflow.active ? "text-green-600" : "text-red-600"}`}>
                <div className={`h-2 w-2 rounded-full ${workflow.active ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                {workflow.active ? "Workflow is active" : "Workflow is paused"}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {workflow.active
                  ? "This workflow is currently live and will trigger based on the defined trigger type."
                  : "This workflow is currently disabled and will not process any triggers."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <UpdateWorkflowDialog
        workflow={workflow}
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
      />
    </div>
  );
}
