"use client";

import { useState } from "react";
import { useAIAgents, useDeleteAIAgent } from "@/features/ai-agents/hooks";
import type { AIAgent } from "@/features/ai-agents/types";
import { AddAIAgentDialog } from "@/features/ai-agents/components/add-ai-agent-dialog";
import { UpdateAIAgentDialog } from "@/features/ai-agents/components/update-ai-agent-dialog";
import { ViewAIAgentDialog } from "@/features/ai-agents/components/view-ai-agent-dialog";
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
  const [editingAgent, setEditingAgent] = useState<AIAgent | null>(null);
  const [viewingAgent, setViewingAgent] = useState<AIAgent | null>(null);

  const { data: agents = [], isLoading } = useAIAgents();
  const { mutate: deleteAgent } = useDeleteAIAgent();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this AI Agent?")) {
      deleteAgent(id);
    }
  };

  const handleEdit = (agent: AIAgent) => {
    setEditingAgent(agent);
  };
  
  const handleView = (agent: AIAgent) => {
    setViewingAgent(agent);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Agents</h1>
          <p className="text-muted-foreground">Manage your AI Agents</p>
        </div>

        <div>
          <AddAIAgentDialog />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Agent List</CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead className="w-[150px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent._id}>
                    <TableCell className="max-w-[150px] truncate">{agent._id}</TableCell>
                    <TableCell>{agent.name}</TableCell>
                    <TableCell>{agent.category || "-"}</TableCell>
                    <TableCell>{agent.environment || "-"}</TableCell>
                    <TableCell>{agent.model || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleView(agent)}
                          title="Detail"
                        >
                          <Eye className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(agent)}
                          title="Update"
                        >
                          <Pencil className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(agent._id as string)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {agents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                      No AI agents found. Create one to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <UpdateAIAgentDialog 
        agent={editingAgent} 
        open={!!editingAgent} 
        onOpenChange={(open) => !open && setEditingAgent(null)} 
      />
      
      <ViewAIAgentDialog
        agent={viewingAgent}
        open={!!viewingAgent}
        onOpenChange={(open) => !open && setViewingAgent(null)}
      />
    </div>
  );
}
