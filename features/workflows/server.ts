import { connectDB } from "@/lib/mongodb";
import Workflow from "@/models/Workflow";
import { Workflow as WorkflowType } from "./types";

// GET
export async function getWorkflowsFromDB(): Promise<WorkflowType[]> {
  await connectDB();

  return await Workflow.find().lean();
}

// CREATE
export async function createWorkflowInDB(data: WorkflowType) {
  await connectDB();

  return await Workflow.create({
    name: data.name,
    description: data.description,
    category: data.category,
    environment: data.environment,
    webhook_url: data.webhook_url,
    workflow_id: data.workflow_id,
    model: data.model,
    slug: data.slug,
    form_url: data.form_url,
    active: data.active,
    triggerType: data.triggerType,
  });
}

// UPDATE
export async function updateWorkflowInDB(id: string, data: Partial<WorkflowType>) {
  await connectDB();

  return await Workflow.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  ).lean();
}

// DELETE
export async function deleteWorkflowInDB(id: string) {
  await connectDB();

  return await Workflow.findByIdAndDelete(id).lean();
}
