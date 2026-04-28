import { AIAgent } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function getAIAgents(): Promise<AIAgent[]> {
  const res = await fetch(`${API_URL}/api/ai-agents`);
  return res.json();
}

export async function createAIAgent(data: AIAgent) {
  const res = await fetch(`${API_URL}/api/ai-agents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function updateAIAgent(data: Partial<AIAgent> & { _id: string }) {
  const res = await fetch(`${API_URL}/api/ai-agents/${data._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteAIAgent(id: string) {
  const res = await fetch(`${API_URL}/api/ai-agents/${id}`, {
    method: "DELETE",
  });

  return res.json();
}
