import { Activity } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function getActivities(): Promise<Activity[]> {
  const res = await fetch(`${API_URL}/api/activities`);
  if (!res.ok) throw new Error("Failed to fetch activities");
  return res.json();
}

export async function syncActivities(executions: any[]): Promise<any> {
  const res = await fetch(`${API_URL}/api/activities/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ executions }),
  });
  if (!res.ok) throw new Error("Failed to sync activities");
  return res.json();
}

export async function getN8nExecutions(): Promise<any> {
  const res = await fetch(`${API_URL}/api/n8n/executions`);
  if (!res.ok) throw new Error("Failed to fetch n8n executions");
  return res.json();
}

export async function getActivity(id: string): Promise<Activity> {
  const res = await fetch(`${API_URL}/api/activities/${id}`);
  if (!res.ok) throw new Error("Failed to fetch activity");
  return res.json();
}
