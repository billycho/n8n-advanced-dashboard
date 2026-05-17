"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkflows, useDeleteWorkflow } from "@/features/workflows/hooks";
import type { Workflow } from "@/features/workflows/types";
import { AddWorkflowDialog } from "@/features/workflows/components/add-workflow-dialog";
import { UpdateWorkflowDialog } from "@/features/workflows/components/update-workflow-dialog";
import { Eye, Pencil, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

export default function WorkflowsPage() {
  const router = useRouter();
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const ITEMS_PER_PAGE = 10;

  const { data: workflows = [], isLoading } = useWorkflows();
  const { mutate: deleteWorkflow } = useDeleteWorkflow();

  const filteredWorkflows = workflows.filter((workflow) => {
    const search = searchQuery.toLowerCase();
    return (
      workflow.name.toLowerCase().includes(search) ||
      (workflow.description && workflow.description.toLowerCase().includes(search))
    );
  });

  const totalPages = Math.ceil(filteredWorkflows.length / ITEMS_PER_PAGE);
  const paginatedWorkflows = filteredWorkflows.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this Workflow?")) {
      deleteWorkflow(id);
    }
  };

  const handleEdit = (workflow: Workflow) => {
    setEditingWorkflow(workflow);
  };

  const handleView = (workflow: Workflow) => {
    router.push(`/dashboard/workflows/${workflow._id}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
          <p className="text-muted-foreground">Manage and automate your business processes</p>
        </div>

        <div>
          <AddWorkflowDialog />
        </div>
      </div>

      <Card className="shadow-md border-primary/10">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>Workflow List</CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search workflows..."
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
                    <TableHead className="w-[20%] whitespace-nowrap truncate">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedWorkflows.map((workflow) => (
                    <TableRow
                      key={workflow._id}
                      onClick={() => handleView(workflow)}
                      className="group cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="w-[20%] whitespace-nowrap truncate font-mono text-xs">
                        {workflow._id}
                      </TableCell>

                      <TableCell className="font-medium">{workflow.name}</TableCell>

                      <TableCell>
                        <Badge variant={workflow.active ? "default" : "secondary"}>
                          {workflow.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline">{workflow.triggerType}</Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">

                          {/* VIEW */}
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Detail"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleView(workflow);
                            }}
                          >
                            <Eye className="h-4 w-4 text-blue-500" />
                          </Button>

                          {/* EDIT */}
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Update"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(workflow);
                            }}
                          >
                            <Pencil className="h-4 w-4 text-green-500" />
                          </Button>

                          {/* DELETE */}
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(workflow._id!);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>

                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {filteredWorkflows.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground py-6"
                      >
                        {searchQuery ? "No workflows found matching your search." : "No workflows found. Create one to get started."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {filteredWorkflows.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between pt-4 mt-4 border-t gap-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredWorkflows.length)} of {filteredWorkflows.length} workflows
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

      <UpdateWorkflowDialog
        workflow={editingWorkflow}
        open={!!editingWorkflow}
        onOpenChange={(open) => !open && setEditingWorkflow(null)}
      />

    </div>
  );
}
