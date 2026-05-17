import mongoose from "mongoose";
import "@/models/AIAgent"; // ✅ must exist somewhere
import "@/models/Workflow";

const ReportSchema = new mongoose.Schema(
  {
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AIAgent",
      required: false,
    },
    workflow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workflow",
      required: false,
    },
    report_date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    report_status: {
      type: String,
      enum: ["success", "failed", "warning"],
      required: true,
    },
    report_summary: {
      type: String,
      required: true,
    },
    error_details: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
