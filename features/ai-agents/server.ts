import { connectDB } from "@/lib/mongodb";
import AIAgent from "@/models/AIAgent";
import { AIAgent as AIAgentType } from "./types";

// GET
export async function getAIAgentsFromDB(): Promise<AIAgentType[]> {
  await connectDB();

  return await AIAgent.find().lean();
}

// CREATE
export async function createAIAgentInDB(data: AIAgentType) {
  await connectDB();

  return await AIAgent.create({
    name: data.name,
    description: data.description,
    category: data.category,
    environment: data.environment,
    webhook_url: data.webhook_url,
    workflow_id: data.workflow_id,
    model: data.model,
    slug: data.slug,
  });
}

// UPDATE
export async function updateAIAgentInDB(id: string, data: Partial<AIAgentType>) {
  await connectDB();

  return await AIAgent.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  ).lean();
}

// DELETE
export async function deleteAIAgentInDB(id: string) {
  await connectDB();

  return await AIAgent.findByIdAndDelete(id).lean();
}
