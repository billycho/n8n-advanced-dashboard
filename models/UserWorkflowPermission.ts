import mongoose from "mongoose";

const UserWorkflowPermissionSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      ref: "User",
    },
    workflow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workflow",
    },
    ai_agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AIAgent",
    },
    assignedBy: {
      type: String,
      ref: "User",
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "user_workflow_permission",
  }
);

export default mongoose.models.UserWorkflowPermission ||
  mongoose.model("UserWorkflowPermission", UserWorkflowPermissionSchema);
