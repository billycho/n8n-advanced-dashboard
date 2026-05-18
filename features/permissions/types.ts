import type { Workflow } from "@/features/workflows/types";
import type { AIAgent } from "@/features/ai-agents/types";

export type UserWorkflowPermission = {
  _id: string;
  user: string;
  workflow?: Workflow;
  ai_agent?: AIAgent;
  assignedBy?: string;
  assignedAt: string;
  createdAt: string;
  updatedAt: string;
};
