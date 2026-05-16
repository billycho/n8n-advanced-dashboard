import mongoose from "mongoose";
import "@/models/AIAgent";
import "@/models/Workflow";

const ActivitySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    finished: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
    },
    status: {
      type: String,
    },
    startedAt: {
      type: Date,
    },
    stoppedAt: {
      type: Date,
    },
    workflowId: {
      type: String,
      required: true,
    },
    ai_agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AIAgent",
    },
    workflow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workflow",
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    activity_json: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);
