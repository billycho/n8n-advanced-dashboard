"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateAIAgent } from "@/features/ai-agents/hooks"
import type { AIAgent } from "@/features/ai-agents/types"

export function AddAIAgentDialog() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<AIAgent>>({})
  const { mutate: createAgent, isPending } = useCreateAIAgent()

  const handleSubmit = () => {
    if (formData.name && formData.slug) {
      createAgent(formData as AIAgent, {
        onSuccess: () => {
          setOpen(false)
          setFormData({}) // reset
        }
      })
    } else {
      alert("Name and Slug are required")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Agent</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New AI Agent</DialogTitle>
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
            <Label>Webhook URL (Optional)</Label>
            <Input 
              placeholder="Enter webhook url" 
              value={formData.webhook_url || ""}
              onChange={(e) => setFormData({ ...formData, webhook_url: e.target.value })}
            />
          </div>

          <Button className="w-full" onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
