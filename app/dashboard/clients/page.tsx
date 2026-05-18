"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClients, useDeleteClient } from "@/features/clients/hooks";
import type { Client } from "@/features/clients/types";
import { AddClientDialog } from "@/features/clients/components/add-client-dialog";
import { UpdateClientDialog } from "@/features/clients/components/update-client-dialog";
import { Eye, Pencil, Trash2, Search, Mail, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/auth-client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ClientsPage() {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } = useSession();
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const ITEMS_PER_PAGE = 10;

  const { data: clients = [], isLoading } = useClients();
  const { mutate: deleteClient } = useDeleteClient();

  useEffect(() => {
    if (!isSessionPending && (session?.user as any)?.role === "client") {
      router.push("/dashboard");
    }
  }, [session, isSessionPending, router]);

  if (isSessionPending || (session?.user as any)?.role === "client") {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredClients = clients.filter((client) => {
    const search = searchQuery.toLowerCase();
    return (
      client.name?.toLowerCase().includes(search) ||
      client.email?.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this Client?")) {
      deleteClient(id);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
  };

  const handleView = (client: Client) => {
    router.push(`/dashboard/clients/${client._id}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your clients and user accounts</p>
        </div>

        <div>
          <AddClientDialog />
        </div>
      </div>

      <Card className="shadow-md border-primary/10">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>Client List</CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search clients..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedClients.map((client) => (
                    <TableRow
                      key={client._id}
                      onClick={() => handleView(client)}
                      className="group cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {client.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : "N/A"}
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Detail"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleView(client);
                            }}
                          >
                            <Eye className="h-4 w-4 text-blue-500" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            title="Update"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(client);
                            }}
                          >
                            <Pencil className="h-4 w-4 text-green-500" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(client._id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {filteredClients.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-muted-foreground py-6"
                      >
                        {searchQuery ? "No clients found matching your search." : "No clients found. Add one to get started."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {filteredClients.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between pt-4 mt-4 border-t gap-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredClients.length)} of {filteredClients.length} clients
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <UpdateClientDialog
        client={editingClient}
        open={!!editingClient}
        onOpenChange={(open) => !open && setEditingClient(null)}
      />
    </div>
  );
}
