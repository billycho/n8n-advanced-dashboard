"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUpdateAIAgent } from "@/features/ai-agents/hooks"
import type { AIAgent } from "@/features/ai-agents/types"

export function UpdateAIAgentDialog({
  agent,
  open,
  onOpenChange
}: {
  agent: AIAgent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [formData, setFormData] = useState<Partial<AIAgent>>({})
  const { mutate: updateAgent, isPending } = useUpdateAIAgent()

  useEffect(() => {
    if (agent) {
      setFormData(agent)
    }
  }, [agent])

  const handleSubmit = () => {
    if (agent?._id) {
      updateAgent(
        { _id: agent._id, ...formData },
        {
          onSuccess: () => {
            onOpenChange(false)
          }
        }
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update AI Agent</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="Enter agent name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              placeholder="Enter description"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Input
              placeholder="Enter category"
              value={formData.category || ""}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              placeholder="Enter slug"
              value={formData.slug || ""}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Workflow ID</Label>
            <Input
              placeholder="Enter workflow id"
              value={formData.workflow_id || ""}
              onChange={(e) => setFormData({ ...formData, workflow_id: e.target.value })}
            />
          </div>

          {/* <div className="space-y-2">
            <Label>Webhook URL (Optional)</Label>
            <Input
              placeholder="Enter webhook url"
              value={formData.webhook_url || ""}
              onChange={(e) => setFormData({ ...formData, webhook_url: e.target.value })}
            />
          </div> */}

          <Button className="w-full" onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Updating..." : "Update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
