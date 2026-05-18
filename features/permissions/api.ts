import { UserWorkflowPermission } from "./types";

export async function getClientPermissions(clientId: string): Promise<UserWorkflowPermission[]> {
  const res = await fetch(`/api/clients/${clientId}/permissions`);
  if (!res.ok) throw new Error("Failed to fetch permissions");
  return res.json();
}

export async function assignPermission({
  clientId,
  workflowId,
  aiAgentId,
}: {
  clientId: string;
  workflowId?: string;
  aiAgentId?: string;
}): Promise<UserWorkflowPermission> {
  const res = await fetch(`/api/clients/${clientId}/permissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ workflowId, aiAgentId }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to assign permission");
  }
  return res.json();
}

export async function unassignPermission({
  clientId,
  permissionId,
}: {
  clientId: string;
  permissionId: string;
}): Promise<void> {
  const res = await fetch(`/api/clients/${clientId}/permissions/${permissionId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to unassign permission");
}

export async function clearPermissions(clientId: string): Promise<void> {
  const res = await fetch(`/api/clients/${clientId}/permissions`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to clear permissions");
}
