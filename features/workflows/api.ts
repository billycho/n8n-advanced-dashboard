import { Workflow } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function getWorkflows(): Promise<Workflow[]> {
  const res = await fetch(`${API_URL}/api/workflows`);
  return res.json();
}

export async function getWorkflow(id: string): Promise<Workflow> {
  const res = await fetch(`${API_URL}/api/workflows/${id}`);
  return res.json();
}

export async function createWorkflow(data: Partial<Workflow>) {
  const res = await fetch(`${API_URL}/api/workflows`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function updateWorkflow(data: Partial<Workflow> & { _id: string }) {
  const res = await fetch(`${API_URL}/api/workflows/${data._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteWorkflow(id: string) {
  const res = await fetch(`${API_URL}/api/workflows/${id}`, {
    method: "DELETE",
  });

  return res.json();
}
