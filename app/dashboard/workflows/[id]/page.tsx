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
import { useEffect } from "react";
import { toast } from "sonner";
import {
  useN8NWorkflow,
  useActivateN8NWorkflow,
  useDeactivateN8NWorkflow,
  extractWorkflowData
} from "@/features/n8n/workflows/hooks";
import cronstrue from "cronstrue";

const N8N_URL = process.env.NEXT_PUBLIC_N8N_URL  || '';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WorkflowAssignment } from "@/features/n8n/workflows/types";

export default function WorkflowDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: workflow, isLoading } = useWorkflow(id);
  const { mutate: deleteWorkflow } = useDeleteWorkflow();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  // n8n Workflow State
  const [workflowEnabled, setWorkflowEnabled] = useState(false);
  const [scheduleTime, setScheduleTime] = useState("");
  const [parameters, setParameters] = useState<WorkflowAssignment[]>([]);
  const [selectedParam, setSelectedParam] = useState<WorkflowAssignment | null>(null);

  const { data: n8nWorkflow, isLoading: isN8NLoading } = useN8NWorkflow(
    workflow?.workflow_id ?? "",
    {
      enabled: !!workflow?.workflow_id,
    }
  );

  const { mutate: activateWorkflow, isPending: isActivating } = useActivateN8NWorkflow();
  const { mutate: deactivateWorkflow, isPending: isDeactivating } = useDeactivateN8NWorkflow();

  useEffect(() => {
    if (n8nWorkflow) {
      const data = extractWorkflowData(n8nWorkflow);
      setWorkflowEnabled(data.active);
      setScheduleTime(data.cronExpression);
      setParameters(data.parameters);
    }
  }, [n8nWorkflow]);

  const handleToggleStatus = () => {
    if (!workflow?.workflow_id) return;

    if (workflowEnabled) {
      deactivateWorkflow(workflow.workflow_id, {
        onSuccess: () => {
          setWorkflowEnabled(false);
          toast.success("Workflow deactivated successfully");
        },
        onError: (error) => {
          toast.error(`Failed to deactivate: ${error.message}`);
        }
      });
    } else {
      activateWorkflow(workflow.workflow_id, {
        onSuccess: () => {
          setWorkflowEnabled(true);
          toast.success("Workflow activated successfully");
        },
        onError: (error) => {
          toast.error(`Failed to activate: ${error.message}`);
        }
      });
    }
  };

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

      {/* n8n Workflow Details Section */}
      {workflow?.workflow_id && (
        <>
          <Card className="shadow-md border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" /> n8n Workflow Settings
              </CardTitle>
              <CardDescription>Manage the automation workflow for this agent</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <a
                href={`${N8N_URL}/workflow/${workflow.workflow_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-muted/20 border border-muted hover:bg-muted/40 transition-colors duration-200 group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Settings className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">n8n Workflow Editor</span>
                    </div>
                    <p className="text-sm font-mono text-muted-foreground truncate max-w-[200px] sm:max-w-md">
                      {N8N_URL}/workflow/{workflow.workflow_id}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                >
                  <Link2 className="h-4 w-4" /> Open Editor
                </Button>
              </a>

              <a
                href={`${N8N_URL}/workflow/${workflow.workflow_id}/executions`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-muted/20 border border-muted hover:bg-muted/40 transition-colors duration-200 group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-muted text-muted-foreground group-hover:bg-blue-500/10 group-hover:text-blue-600 transition-colors">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">Execution History</span>
                    </div>
                    <p className="text-sm font-mono text-muted-foreground truncate max-w-[200px] sm:max-w-md">
                      {N8N_URL}/workflow/{workflow.workflow_id}/executions
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="gap-2 group-hover:bg-blue-600 group-hover:text-white transition-all"
                >
                  <Activity className="h-4 w-4" /> View Executions
                </Button>
              </a>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-muted/20 border border-muted hover:bg-muted/40 transition-colors duration-200 group">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${workflowEnabled ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}>
                    {workflowEnabled ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">Workflow Status</span>
                      <Badge variant={workflowEnabled ? "default" : "destructive"}>
                        {workflowEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">The workflow is currently {workflowEnabled ? "running on schedule" : "paused"}</p>
                  </div>
                </div>
                <Button
                  variant={workflowEnabled ? "outline" : "default"}
                  className="gap-2"
                  onClick={handleToggleStatus}
                  disabled={isActivating || isDeactivating}
                >
                  {workflowEnabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isActivating || isDeactivating ? "Processing..." : (workflowEnabled ? "Disable Workflow" : "Enable Workflow")}
                </Button>
              </div>

              {scheduleTime && (
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-muted/20 border border-muted hover:bg-muted/40 transition-colors duration-200 group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-blue-500/10 text-blue-600">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">Schedule Time</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {(() => {
                          try {
                            return cronstrue.toString(scheduleTime);
                          } catch (e) {
                            return `Runs on schedule: ${scheduleTime}`;
                          }
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* n8n Workflow Parameters Section */}
          <Card className="shadow-md border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" /> Workflow Parameters
                </CardTitle>
                <CardDescription>Custom variables passed to the n8n execution environment</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[20%] font-bold">Key</TableHead>
                      <TableHead className="font-bold">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parameters.length > 0 ? (
                      parameters.map((param, i) => (
                        <TableRow
                          key={i}
                          className="group cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => setSelectedParam(param)}
                        >
                          <TableCell className="w-[20%] font-mono text-sm max-w-[200px] truncate" title={param.name}>
                            {param.name}
                          </TableCell>
                          <TableCell className="text-sm max-w-[300px] truncate text-muted-foreground" title={param.value}>
                            {param.value}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                          No parameters configured in the n8n workflow.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Parameter Detail Dialog */}
          <Dialog open={!!selectedParam} onOpenChange={(open) => !open && setSelectedParam(null)}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" /> Parameter Details
                </DialogTitle>
                <DialogDescription>
                  View the key and value for this workflow parameter.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Key</Label>
                  <div className="p-3 rounded-md bg-muted font-mono text-sm break-all border border-muted">
                    {selectedParam?.name}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Value</Label>
                  <textarea
                    value={selectedParam?.value || ""}
                    readOnly
                    className="flex min-h-[200px] w-full rounded-md border border-muted bg-muted/30 px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-0 cursor-pointer resize-none active:bg-muted/50 transition-colors"
                    onClick={() => {
                      if (selectedParam?.value) {
                        navigator.clipboard.writeText(selectedParam.value);
                        toast.success("Value copied to clipboard");
                      }
                    }}
                  />
                  <p className="text-[10px] text-muted-foreground italic">Click the text box above to copy the value to your clipboard</p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setSelectedParam(null)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}

      <UpdateWorkflowDialog
        workflow={workflow}
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
      />
    </div>
  );
}
