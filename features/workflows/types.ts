export type Workflow = {
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
  form_url?: string;
  active: boolean;
  triggerType: "Schedule" | "Webhook" | "Manual" | "Form";
  createdAt: Date;
  updatedAt: Date;
};
