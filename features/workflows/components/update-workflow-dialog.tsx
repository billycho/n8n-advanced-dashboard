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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useUpdateWorkflow } from "@/features/workflows/hooks"
import type { Workflow } from "@/features/workflows/types"

export function UpdateWorkflowDialog({
  workflow,
  open,
  onOpenChange
}: {
  workflow: Workflow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [formData, setFormData] = useState<Partial<Workflow>>({})
  const { mutate: updateWorkflow, isPending } = useUpdateWorkflow()

  useEffect(() => {
    if (workflow) {
      setFormData(workflow)
    }
  }, [workflow])

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = () => {
    if (workflow?._id) {
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

      updateWorkflow(
        { _id: workflow._id, ...formData },
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
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Workflow</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="Enter workflow name"
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
            <Label>Environment</Label>
            <Select
              value={formData.environment || ""}
              onValueChange={(val: "dev" | "staging" | "prod") => setFormData({ ...formData, environment: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dev">Dev</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="prod">Prod</SelectItem>
              </SelectContent>
            </Select>
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
            <Label>n8n Workflow ID</Label>
            <Input
              placeholder="Enter workflow id"
              value={formData.workflow_id || ""}
              onChange={(e) => setFormData({ ...formData, workflow_id: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Model</Label>
            <Input
              placeholder="Enter model"
              value={formData.model || ""}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
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
                placeholder="https://forms.gle/..." 
                value={formData.form_url || ""}
                onChange={(e) => setFormData({ ...formData, form_url: e.target.value })}
                className="border-primary/50 focus-visible:ring-primary"
              />
              <p className="text-[10px] text-muted-foreground italic">Required for Form trigger</p>
            </div>
          )}

          <Button className="w-full" onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Updating..." : "Update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
