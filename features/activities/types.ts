import { AIAgent } from "../ai-agents/types";
import { Workflow } from "../workflows/types";

export interface Activity {
  _id: string;
  id: string;
  finished: boolean;
  mode: string;
  status: string;
  startedAt: string;
  stoppedAt: string;
  workflowId: string;
  ai_agent?: AIAgent;
  workflow?: Workflow;
  data: any;
  activity_json: any;
  createdAt: string;
  updatedAt: string;
}
