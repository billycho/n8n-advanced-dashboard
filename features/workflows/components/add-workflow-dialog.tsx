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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useCreateWorkflow } from "@/features/workflows/hooks"
import type { Workflow } from "@/features/workflows/types"

export function AddWorkflowDialog() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Workflow>>({
    active: true,
    triggerType: "Schedule",
  })
  const { mutate: createWorkflow, isPending } = useCreateWorkflow()

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = () => {
    if (!formData.name) {
      alert("Name is required");
      return;
    }

    if (formData.triggerType === "Form") {
      if (!formData.form_url) {
        alert("Form URL is required for Form trigger type");
        return;
      }
      if (!isValidUrl(formData.form_url)) {
        alert("Please enter a valid URL for the Form URL");
        return;
      }
    }

    createWorkflow(formData as Workflow, {
      onSuccess: () => {
        setOpen(false)
        setFormData({
          active: true,
          triggerType: "Schedule",
        }) // reset
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Workflow</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Workflow</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input 
              placeholder="Enter workflow name" 
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>n8n Workflow ID</Label>
            <Input 
              placeholder="Enter workflow id" 
              value={formData.workflow_id || ""}
              onChange={(e) => setFormData({ ...formData, workflow_id: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between space-x-2 p-2 border rounded-md">
            <div className="space-y-0.5">
              <Label>Active Status</Label>
              <p className="text-xs text-muted-foreground">Enable or disable this workflow</p>
            </div>
            <Switch 
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label>Trigger Type</Label>
            <Select 
              value={formData.triggerType} 
              onValueChange={(value: any) => setFormData({ ...formData, triggerType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select trigger type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Schedule">Schedule</SelectItem>
                {/* <SelectItem value="Webhook">Webhook</SelectItem> */}
                <SelectItem value="Manual">Manual</SelectItem>
                <SelectItem value="Form">Form</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.triggerType === "Form" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label className="text-primary font-semibold">Form URL</Label>
              <Input 
                placeholder="https://forms.com/123..." 
                value={formData.form_url || ""}
                onChange={(e) => setFormData({ ...formData, form_url: e.target.value })}
                className="border-primary/50 focus-visible:ring-primary"
              />
              <p className="text-[10px] text-muted-foreground italic">Required for Form trigger</p>
            </div>
          )}

          <Button className="w-full" onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
