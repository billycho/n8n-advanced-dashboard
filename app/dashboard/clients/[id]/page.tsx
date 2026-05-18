"use client";

import { use } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useClient, useDeleteClient } from "@/features/clients/hooks";
import { UpdateClientDialog } from "@/features/clients/components/update-client-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Pencil, Trash2, Mail, Hash, UserCircle, Calendar, Plus, Shield, ShieldAlert, Cpu } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useWorkflows } from "@/features/workflows/hooks";
import { useAIAgents } from "@/features/ai-agents/hooks";
import {
  useClientPermissions,
  useAssignPermission,
  useUnassignPermission,
  useClearPermissions,
} from "@/features/permissions/hooks";

export default function ClientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: client, isLoading } = useClient(id);
  const { mutate: deleteClient } = useDeleteClient();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  // Permission hooks
  const { data: permissions = [], isLoading: isPermissionsLoading } = useClientPermissions(id);
  const { mutate: assignPermission, isPending: isAssigning } = useAssignPermission(id);
  const { mutate: unassignPermission } = useUnassignPermission(id);
  const { mutate: clearPermissions, isPending: isClearing } = useClearPermissions(id);

  // Selector hooks
  const { data: workflows = [] } = useWorkflows();
  const { data: aiAgents = [] } = useAIAgents();

  // Modal State
  const [assignmentType, setAssignmentType] = useState<"workflow" | "ai_agent">("workflow");
  const [selectedResourceId, setSelectedResourceId] = useState<string>("");

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this Client?")) {
      deleteClient(id, {
        onSuccess: () => {
          router.push("/dashboard/clients");
        },
      });
    }
  };

  const handleAssign = () => {
    if (!selectedResourceId) {
      alert("Please select a resource to assign");
      return;
    }

    assignPermission(
      {
        clientId: id,
        workflowId: assignmentType === "workflow" ? selectedResourceId : undefined,
        aiAgentId: assignmentType === "ai_agent" ? selectedResourceId : undefined,
      },
      {
        onSuccess: () => {
          setIsAssignDialogOpen(false);
          setSelectedResourceId("");
        },
      }
    );
  };

  const handleUnassign = (permissionId: string) => {
    if (confirm("Are you sure you want to unassign this resource from the client?")) {
      unassignPermission({ clientId: id, permissionId });
    }
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear ALL resource assignments for this client?")) {
      clearPermissions(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to List
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Client not found.</p>
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
            <ArrowLeft className="h-4 w-4" /> Back to Clients
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold tracking-tight">{client.name}</h1>
            <Badge variant="default" className="capitalize">
              {client.role || "Client"}
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground flex items-center gap-2 mt-1">
             <Mail className="h-4 w-4" /> {client.email}
          </p>
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
              <UserCircle className="h-5 w-5 text-primary" /> Profile Details
            </CardTitle>
            <CardDescription>Core information and identity of this client</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-muted">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3 w-3" /> Client ID
                </Label>
                <p className="font-mono text-sm break-all">{client._id}</p>
              </div>

              <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-muted">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" /> Email Address
                </Label>
                <p className="font-semibold">{client.email}</p>
              </div>

              <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-muted">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <UserCircle className="h-3 w-3" /> Full Name
                </Label>
                <p className="font-semibold">{client.name}</p>
              </div>

              <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-muted">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Joined At
                </Label>
                <p className="font-semibold">
                  {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : "Unknown"}
                </p>
              </div>
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
                <span className="text-sm text-muted-foreground">System Role</span>
                <span className="text-sm font-semibold capitalize">{client.role || "Client"}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-muted">
                <span className="text-sm text-muted-foreground">Created At</span>
                <span className="text-sm font-semibold text-right">  {client.createdAt ? new Date(client.createdAt).toLocaleString() : "Unknown"}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Updated At</span>
                <span className="text-sm font-semibold text-right">  {client.updatedAt ? new Date(client.updatedAt).toLocaleString() : "Unknown"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assignments & Permissions Card */}
      <Card className="shadow-md border-primary/10">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> Resource Assignments
            </CardTitle>
            <CardDescription>Assign specific workflows or AI agents to this client</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {permissions.length > 0 && (
              <Button
                variant="outline"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleClearAll}
                disabled={isClearing}
              >
                <ShieldAlert className="h-4 w-4 mr-2" /> Clear All Permissions
              </Button>
            )}
            <Button className="gap-2" onClick={() => setIsAssignDialogOpen(true)}>
              <Plus className="h-4 w-4" /> Assign Resource
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isPermissionsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Type</TableHead>
                    <TableHead>Resource Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Assigned On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.length > 0 ? (
                    permissions.map((perm) => {
                      const isWorkflow = !!perm.workflow;
                      const resource = isWorkflow ? perm.workflow : perm.ai_agent;
                      return (
                        <TableRow key={perm._id} className="hover:bg-muted/50 transition-colors">
                          <TableCell className="font-semibold">
                            <Badge variant={isWorkflow ? "outline" : "secondary"}>
                              {isWorkflow ? "Workflow" : "AI Agent"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold flex items-center gap-2">
                            {isWorkflow ? (
                              <Calendar className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Cpu className="h-4 w-4 text-green-500" />
                            )}
                            {resource?.name || "N/A"}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                            {resource?.description || "No description available"}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {new Date(perm.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Unassign"
                              onClick={() => handleUnassign(perm._id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                        No resources assigned to this client. Click "Assign Resource" to delegate access.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign Resource Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Resource to Client</DialogTitle>
            <DialogDescription>
              Select a Workflow or AI Agent to authorize access for {client.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Resource Type</Label>
              <Select
                value={assignmentType}
                onValueChange={(val: "workflow" | "ai_agent") => {
                  setAssignmentType(val);
                  setSelectedResourceId("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workflow">Workflow</SelectItem>
                  <SelectItem value="ai_agent">AI Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select {assignmentType === "workflow" ? "Workflow" : "AI Agent"}</Label>
              <Select value={selectedResourceId} onValueChange={setSelectedResourceId}>
                <SelectTrigger>
                  <SelectValue placeholder={`Select a ${assignmentType === "workflow" ? "workflow" : "agent"}`} />
                </SelectTrigger>
                <SelectContent>
                  {assignmentType === "workflow"
                    ? workflows.map((wf) => (
                        <SelectItem key={wf._id} value={wf._id || ""}>
                          {wf.name}
                        </SelectItem>
                      ))
                    : aiAgents.map((agent) => (
                        <SelectItem key={agent._id} value={agent._id || ""}>
                          {agent.name}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={isAssigning || !selectedResourceId}>
              {isAssigning ? "Assigning..." : "Assign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <UpdateClientDialog
        client={client}
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
      />
    </div>
  );
}
