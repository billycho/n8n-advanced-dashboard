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
import { useCreateClient } from "@/features/clients/hooks"
import type { Client } from "@/features/clients/types"

export function AddClientDialog() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
  const { mutate: createClient, isPending } = useCreateClient()
  const [error, setError] = useState("")

  const handleSubmit = () => {
    setError("")
    if (formData.name && formData.email && formData.password) {
      createClient(formData, {
        onSuccess: () => {
          setOpen(false)
          setFormData({ name: "", email: "", password: "" }) // reset
        },
        onError: (err: any) => {
          setError(err.message || "Failed to create client")
        }
      })
    } else {
      setError("Name, Email, and Password are required")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Client</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Client</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="space-y-2">
            <Label>Name</Label>
            <Input 
              placeholder="Enter client name" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input 
              type="email"
              placeholder="Enter client email" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input 
              type="password"
              placeholder="Enter client password" 
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
