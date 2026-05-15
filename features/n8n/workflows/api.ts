import { N8NWorkflow } from "./types";

const INTERNAL_API_URL = "/api/n8n/workflows";

export async function getN8NWorkflow(id: string): Promise<N8NWorkflow> {
  const res = await fetch(`${INTERNAL_API_URL}/${id}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch workflow: ${res.statusText}`);
  }

  console.log(`Fetched workflow with ID ${id}:`, await res.clone().json());

  return res.json();
}

export async function updateN8NWorkflow(id: string, data: Partial<N8NWorkflow>) {
  const res = await fetch(`${INTERNAL_API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Failed to update workflow: ${res.statusText}`);
  }

  return res.json();
}

export async function activateN8NWorkflow(id: string) {
  const res = await fetch(`${INTERNAL_API_URL}/${id}/activate`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error(`Failed to activate workflow: ${res.statusText}`);
  }

  return res.json();
}

export async function deactivateN8NWorkflow(id: string) {
  const res = await fetch(`${INTERNAL_API_URL}/${id}/deactivate`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error(`Failed to deactivate workflow: ${res.statusText}`);
  }

  return res.json();
}
