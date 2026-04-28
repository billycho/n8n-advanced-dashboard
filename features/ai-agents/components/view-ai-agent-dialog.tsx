"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type { AIAgent } from "@/features/ai-agents/types"

export function ViewAIAgentDialog({ 
  agent, 
  open, 
  onOpenChange 
}: { 
  agent: AIAgent | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  if (!agent) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Agent Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-3 items-center gap-4 border-b pb-2">
            <Label className="text-right text-muted-foreground">ID</Label>
            <div className="col-span-2">{agent._id}</div>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4 border-b pb-2">
            <Label className="text-right text-muted-foreground">Name</Label>
            <div className="col-span-2">{agent.name}</div>
          </div>

          <div className="grid grid-cols-3 items-center gap-4 border-b pb-2">
            <Label className="text-right text-muted-foreground">Description</Label>
            <div className="col-span-2">{agent.description || "-"}</div>
          </div>

          <div className="grid grid-cols-3 items-center gap-4 border-b pb-2">
            <Label className="text-right text-muted-foreground">Category</Label>
            <div className="col-span-2">{agent.category || "-"}</div>
          </div>

          <div className="grid grid-cols-3 items-center gap-4 border-b pb-2">
            <Label className="text-right text-muted-foreground">Environment</Label>
            <div className="col-span-2">{agent.environment || "-"}</div>
          </div>

          <div className="grid grid-cols-3 items-center gap-4 border-b pb-2">
            <Label className="text-right text-muted-foreground">Model</Label>
            <div className="col-span-2">{agent.model || "-"}</div>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4 border-b pb-2">
            <Label className="text-right text-muted-foreground">Slug</Label>
            <div className="col-span-2">{agent.slug || "-"}</div>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-right text-muted-foreground">Webhook URL</Label>
            <div className="col-span-2 break-all">{agent.webhook_url || "-"}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
