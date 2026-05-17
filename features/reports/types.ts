import { AIAgent } from "../ai-agents/types";
import { Workflow } from "../workflows/types";

export interface Report {
  _id: string;
  agent?: AIAgent;
  workflow?: Workflow;
  report_date: string;
  report_status: "success" | "failed" | "warning";
  report_summary: string;
  error_details?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}
