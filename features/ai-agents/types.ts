export type AIAgent = {
  _id?: string;
  name: string;
  description?: string;
  category?: string;
  environment?: "dev" | "staging" | "prod";
  webhook_url?: string;
  workflow_id?: string;
  model?: string;
  last_run_at?: Date;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};
