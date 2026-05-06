"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAIAgents, useDeleteAIAgent } from "@/features/ai-agents/hooks";
import type { AIAgent } from "@/features/ai-agents/types";
import { AddAIAgentDialog } from "@/features/ai-agents/components/add-ai-agent-dialog";
import { UpdateAIAgentDialog } from "@/features/ai-agents/components/update-ai-agent-dialog";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function AIAgentsPage() {
  const router = useRouter();
  const [editingAgent, setEditingAgent] = useState<AIAgent | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { data: agents = [], isLoading } = useAIAgents();
  const { mutate: deleteAgent } = useDeleteAIAgent();

  const totalPages = Math.ceil(agents.length / ITEMS_PER_PAGE);
  const paginatedAgents = agents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this AI Agent?")) {
      deleteAgent(id);
    }
  };

  const handleEdit = (agent: AIAgent) => {
    setEditingAgent(agent);
  };

  const handleView = (agent: AIAgent) => {
    router.push(`/dashboard/ai-agents/${agent._id}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Agents</h1>
          <p className="text-muted-foreground">Manage and monitor your fleet of AI agents</p>
        </div>

        <div>
          <AddAIAgentDialog />
        </div>
      </div>

      <Card className="shadow-md border-primary/10">
        <CardHeader>
          <CardTitle>AI Agent List</CardTitle>
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedAgents.map((agent) => (
                    <TableRow
                      key={agent._id}
                      onClick={() => handleView(agent)}
                      className="group cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="w-[20%] whitespace-nowrap truncate">
                        {agent._id}
                      </TableCell>

                      <TableCell>{agent.name}</TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">

                          {/* VIEW */}
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Detail"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleView(agent);
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
                              handleEdit(agent);
                            }}
                          >
                            <Pencil className="h-4 w-4 text-green-500" />
                          </Button>

                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {agents.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-muted-foreground py-6"
                      >
                        No AI agents found. Create one to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {agents.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between pt-4 mt-4 border-t gap-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, agents.length)} of {agents.length} agents
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

      <UpdateAIAgentDialog
        agent={editingAgent}
        open={!!editingAgent}
        onOpenChange={(open) => !open && setEditingAgent(null)}
      />

    </div>
  );
}
