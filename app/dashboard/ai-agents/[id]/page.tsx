"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useAIAgent, useDeleteAIAgent } from "@/features/ai-agents/hooks";
import { UpdateAIAgentDialog } from "@/features/ai-agents/components/update-ai-agent-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft, Pencil, Trash2, Calendar, Globe, Cpu, Hash, Link2, Box,
  Play, Pause, Settings, Plus, AlertCircle, Clock, Database
} from "lucide-react";
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
import { useEffect } from "react";
import { toast } from "sonner";

import { useN8NWorkflow, useUpdateN8NWorkflow, extractWorkflowData } from "@/features/workflows/hooks";

export default function AIAgentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: agent, isLoading } = useAIAgent(id);
  const { mutate: deleteAgent } = useDeleteAIAgent();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  // n8n Workflow State
  const [workflowEnabled, setWorkflowEnabled] = useState(true);
  const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [tempSchedule, setTempSchedule] = useState("09:00");

  // n8n Parameters State
  const [parameters, setParameters] = useState<{ id: string; name: string; value: string; type: string }[]>([]);
  const [isParamDialogOpen, setIsParamDialogOpen] = useState(false);
  const [editingParam, setEditingParam] = useState<{ id: string; name: string; value: string; type: string } | null>(null);
  const [paramKey, setParamKey] = useState("");
  const [paramValue, setParamValue] = useState("");


  const { data: workflow, isLoading: isWorkflowLoading } = useN8NWorkflow(
    agent?.workflow_id ?? "",
    {
      enabled: !!agent?.workflow_id,
    }
  );

  // Load parameters from localStorage
  useEffect(() => {
    const savedParams = localStorage.getItem(`n8n_params_${id}`);
    if (savedParams) {
      setParameters(JSON.parse(savedParams));
    }
  }, [id]);

  // useEffect(() => {
  //   console.log("asdadasdad");
  //   if (!isLoading && agent) {
  //     console.log("agent name:", agent.name);
  //   }
  // }, [isLoading, agent]);

  useEffect(() => {
    if (workflow) {
      console.log("Workflow data:", workflow);
      const data = extractWorkflowData(workflow);
      setWorkflowEnabled(data.active);
      setScheduleTime(data.cronExpression);
      console.log("Extracted parameters from workflow:", data.parameters);
      setParameters(data.parameters);
    }
  }, [workflow]);

  // Save parameters to localStorage
  const saveParameters = (newParams: { id: string; name: string; value: string; type: string  }[]) => {
    setParameters(newParams);
    localStorage.setItem(`n8n_params_${id}`, JSON.stringify(newParams));
  };

  const handleToggleStatus = () => {
    setWorkflowEnabled(!workflowEnabled);
    setIsStatusConfirmOpen(false);
    toast.success(`Workflow ${!workflowEnabled ? "enabled" : "disabled"} successfully`);
  };

  const handleUpdateSchedule = () => {
    setScheduleTime(tempSchedule);
    setIsScheduleDialogOpen(false);
    toast.success("Schedule updated successfully");
  };

  const handleAddParam = () => {
    if (!paramKey || !paramValue) {
      toast.error("Please fill in both key and value");
      return;
    }

    if (editingParam) {
      const newParams = parameters.map(p => p.id === editingParam.id ? { ...p, key: paramKey, value: paramValue } : p);
      saveParameters(newParams);
      toast.success("Parameter updated");
    } else {
      const newParam = { id: Math.random().toString(36).substr(2, 9), name: paramKey, value: paramValue, type: "string" };
      saveParameters([...parameters, newParam]);
      toast.success("Parameter added");
    }

    setIsParamDialogOpen(false);
    setEditingParam(null);
    setParamKey("");
    setParamValue("");
  };

  const handleDeleteParam = (paramId: string) => {
    const newParams = parameters.filter(p => p.id !== paramId);
    saveParameters(newParams);
    toast.success("Parameter deleted");
  };

   const openEditParam = (param: { id: string; name: string; value: string; type: string }) => {
    setEditingParam(param);
    setParamKey(param.name);
    setParamValue(param.value);
    setIsParamDialogOpen(true);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this AI Agent?")) {
      deleteAgent(id, {
        onSuccess: () => {
          router.push("/dashboard/ai-agents");
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

  if (!agent) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to List
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">AI Agent not found.</p>
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
            <ArrowLeft className="h-4 w-4" /> Back to Agents
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold tracking-tight">{agent.name}</h1>
            {agent.environment && (
              <Badge variant={agent.environment === "prod" ? "default" : "secondary"} className="capitalize">
                {agent.environment}
              </Badge>
            )}
          </div>
          <p className="text-lg text-muted-foreground">{agent.description || "No description provided."}</p>
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
              <Cpu className="h-5 w-5 text-primary" /> Configuration
            </CardTitle>
            <CardDescription>Core settings and identity of your AI agent</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-muted">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3 w-3" /> Agent ID
                </Label>
                <p className="font-mono text-sm break-all">{agent._id}</p>
              </div>

              <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-muted">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Box className="h-3 w-3" /> Model
                </Label>
                <p className="font-semibold capitalize">{agent.model || "Not specified"}</p>
              </div>

              <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-muted">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Globe className="h-3 w-3" /> Slug
                </Label>
                <p className="font-medium">{agent.slug}</p>
              </div>

              <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-muted">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Last Run
                </Label>
                <p className="font-medium">
                  {agent.last_run_at ? new Date(agent.last_run_at).toLocaleString() : "Never run"}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3 w-3" /> Workflow ID
                </Label>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 font-mono text-sm border border-secondary">
                  {agent.workflow_id || "No workflow assigned"}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Link2 className="h-3 w-3" /> Webhook URL
                </Label>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 font-mono text-sm border border-secondary">
                  {agent.webhook_url || "No webhook URL configured"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status / Category */}
        <div className="space-y-6">
          <Card className="shadow-md border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-muted">
                <span className="text-sm text-muted-foreground">Category</span>
                <Badge variant="outline" className="capitalize">{agent.category || "General"}</Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-muted">
                <span className="text-sm text-muted-foreground">Environment</span>
                <span className="text-sm font-medium capitalize">{agent.environment || "Not set"}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Created At</span>
                <span className="text-sm font-medium">N/A</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Integration Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Active and ready
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                This agent is currently synchronized with the central workflow engine and receiving updates.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* n8n Workflow Details Section */}
      <Card className="shadow-md border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" /> n8n Workflow Settings
          </CardTitle>
          <CardDescription>Manage the automation workflow for this agent</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-muted/20 border border-muted">
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
              onClick={() => setIsStatusConfirmOpen(true)}
            >
              {workflowEnabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {workflowEnabled ? "Disable Workflow" : "Enable Workflow"}
            </Button>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-muted/20 border border-muted">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-500/10 text-blue-600">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">Schedule Time</span>
                </div>
                <p className="text-sm text-muted-foreground">Runs every day at <span className="font-mono font-bold text-primary">{scheduleTime}</span></p>
              </div>
            </div>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                setTempSchedule(scheduleTime);
                setIsScheduleDialogOpen(true);
              }}
            >
              <Pencil className="h-4 w-4" /> Change Schedule
            </Button>
          </div>
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
          <Button size="sm" className="gap-2" onClick={() => {
            setEditingParam(null);
            setParamKey("");
            setParamValue("");
            setIsParamDialogOpen(true);
          }}>
            <Plus className="h-4 w-4" /> Add Parameter
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-bold">Key</TableHead>
                  <TableHead className="font-bold">Value</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parameters.length > 0 ? (
                  parameters.map((param) => (
                    <TableRow key={param.id} className="group">
                      <TableCell className="font-mono text-sm">{param.name}</TableCell>
                      <TableCell className="text-sm">{param.value}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEditParam(param)}>
                            <Pencil className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteParam(param.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No parameters configured. Click "Add Parameter" to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}

      {/* Status Toggle Confirmation */}
      <Dialog open={isStatusConfirmOpen} onOpenChange={setIsStatusConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {workflowEnabled ? "disable" : "enable"} the n8n workflow for this agent?
              {workflowEnabled && " This will stop all automated tasks associated with this agent."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusConfirmOpen(false)}>Cancel</Button>
            <Button variant={workflowEnabled ? "destructive" : "default"} onClick={handleToggleStatus}>
              {workflowEnabled ? "Disable Workflow" : "Enable Workflow"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Edit Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Schedule</DialogTitle>
            <DialogDescription>
              Set the cron expression for the daily workflow execution.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cron" className="text-right">Cron Expression</Label>
              <Input
                id="cron"
                value={tempSchedule}
                onChange={(e) => setTempSchedule(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateSchedule}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Parameter Add/Edit Dialog */}
      <Dialog open={isParamDialogOpen} onOpenChange={setIsParamDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingParam ? "Edit Parameter" : "Add New Parameter"}</DialogTitle>
            <DialogDescription>
              Define a key-value pair for the workflow environment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="key" className="text-right text-xs font-bold uppercase">Key</Label>
              <Input
                id="key"
                value={paramKey}
                onChange={(e) => setParamKey(e.target.value)}
                placeholder="e.g. API_KEY"
                className="col-span-3 font-mono"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right text-xs font-bold uppercase">Value</Label>
              <Input
                id="value"
                value={paramValue}
                onChange={(e) => setParamValue(e.target.value)}
                placeholder="e.g. secret-token"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsParamDialogOpen(false);
              setEditingParam(null);
            }}>Cancel</Button>
            <Button onClick={handleAddParam}>{editingParam ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <UpdateAIAgentDialog
        agent={agent}
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
      />
    </div>
  );
}
