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
import { ArrowLeft, Pencil, Trash2, Mail, Hash, UserCircle, Calendar } from "lucide-react";

export default function ClientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: client, isLoading } = useClient(id);
  const { mutate: deleteClient } = useDeleteClient();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this Client?")) {
      deleteClient(id, {
        onSuccess: () => {
          router.push("/dashboard/clients");
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
                <p className="font-medium">{client.name}</p>
              </div>

              <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-muted">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Joined At
                </Label>
                <p className="font-medium">
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
                <span className="text-sm font-medium capitalize">{client.role || "Client"}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-muted">
                <span className="text-sm text-muted-foreground">Created At</span>
                <span className="text-sm font-medium text-right">  {client.createdAt ? new Date(client.createdAt).toLocaleString() : "Unknown"}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Updated At</span>
                <span className="text-sm font-medium text-right">  {client.updatedAt ? new Date(client.updatedAt).toLocaleString() : "Unknown"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <UpdateClientDialog
        client={client}
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
      />
    </div>
  );
}
