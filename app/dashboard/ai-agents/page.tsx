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
    router.push(`/dashboard/ai-agents/${agent._id}`);
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
      <TableHead className="w-[20%] whitespace-nowrap truncate">ID</TableHead>
      <TableHead>Name</TableHead>
      {/* <TableHead className="w-[25px] text-right">Actions</TableHead> */}
    </TableRow>
  </TableHeader>

  <TableBody>
    {agents.map((agent) => (
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
