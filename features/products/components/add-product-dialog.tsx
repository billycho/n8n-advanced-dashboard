// "use client"

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

export function AddProductDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Add New</Button>
  </DialogTrigger>

<DialogContent>
    <DialogHeader>
      <DialogTitle>Create New Product</DialogTitle>
    </DialogHeader>

    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Name</Label>
        <Input placeholder="Enter name" />
      </div>

      <div className="space-y-2">
        <Label>Email</Label>
        <Input placeholder="Enter email" />
      </div>

      <div className="space-y-2">
        <Label>Role</Label>
        <Input placeholder="Enter role" />
      </div>

      <Button className="w-full" onClick={() => setOpen(false)}>
        Submit
      </Button>
    </div>
  </DialogContent>
</Dialog>

  )
}
