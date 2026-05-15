"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { Workflow } from "@/features/workflows/types"

export function ViewWorkflowDialog({ 
  workflow, 
  open, 
  onOpenChange 
}: { 
  workflow: Workflow | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  if (!workflow) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Workflow Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-3 items-center gap-4 border-b pb-2">
            <Label className="text-right text-muted-foreground">ID</Label>
            <div className="col-span-2 font-mono text-xs">{workflow._id}</div>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4 border-b pb-2">
            <Label className="text-right text-muted-foreground">Name</Label>
            <div className="col-span-2 font-semibold">{workflow.name}</div>
          </div>

          <div className="grid grid-cols-3 items-center gap-4 border-b pb-2">
            <Label className="text-right text-muted-foreground">Status</Label>
            <div className="col-span-2">
              <Badge variant={workflow.active ? "default" : "destructive"}>
                {workflow.active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-3 items-center gap-4 border-b pb-2">
            <Label className="text-right text-muted-foreground">Trigger</Label>
            <div className="col-span-2">{workflow.triggerType}</div>
          </div>

          <div className="grid grid-cols-3 items-center gap-4 border-b pb-2">
            <Label className="text-right text-muted-foreground">Description</Label>
            <div className="col-span-2">{workflow.description || "-"}</div>
          </div>

          <div className="grid grid-cols-3 items-center gap-4 border-b pb-2">
            <Label className="text-right text-muted-foreground">Category</Label>
            <div className="col-span-2">{workflow.category || "-"}</div>
          </div>

          <div className="grid grid-cols-3 items-center gap-4 border-b pb-2">
            <Label className="text-right text-muted-foreground">Environment</Label>
            <div className="col-span-2 capitalize">{workflow.environment || "-"}</div>
          </div>

          <div className="grid grid-cols-3 items-center gap-4 border-b pb-2">
            <Label className="text-right text-muted-foreground">Model</Label>
            <div className="col-span-2">{workflow.model || "-"}</div>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4 border-b pb-2">
            <Label className="text-right text-muted-foreground">Slug</Label>
            <div className="col-span-2">{workflow.slug || "-"}</div>
          </div>

          {workflow.form_url && (
            <div className="grid grid-cols-3 items-center gap-4 border-b pb-2">
              <Label className="text-right text-muted-foreground">Form URL</Label>
              <div className="col-span-2 text-primary hover:underline cursor-pointer truncate" onClick={() => window.open(workflow.form_url, '_blank')}>
                {workflow.form_url}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-right text-muted-foreground">n8n Workflow ID</Label>
            <div className="col-span-2 break-all font-mono text-xs">{workflow.workflow_id || "-"}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
