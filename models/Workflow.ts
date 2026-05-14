import mongoose from "mongoose";

const WorkflowSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    environment: {
      type: String,
      enum: ["dev", "staging", "prod"],
      default: "dev",
    },
    workflow_id: {
      type: String,
    },
    webhook_url: {
      type: String,
    },
    model: {
      type: String
    },
    last_run_at: {
      type: Date,
    },
    slug: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    triggerType: {
      type: String,
      enum: ["Schedule", "Webhook", "Manual", "Form"],
      default: "Schedule",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Workflow || mongoose.model("Workflow", WorkflowSchema);
