import { N8NWorkflow } from "./types";

const N8N_API_URL = "https://n8n.nodemationhub.com/api/v1";
const N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4Nzc2ZDYyNS05NjhjLTRkYTctODRmMy1hZWQ0YTE0NzI2YmIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzc3NTE0MTI4fQ.LKHG98_MZNFT6s4ct7ESLmugeBaRw3Bk5Gr6Fl52HxM";

export async function getN8NWorkflow(id: string): Promise<N8NWorkflow> {
  const res = await fetch(`${N8N_API_URL}/workflows/${id}?excludePinnedData=true`, {
    headers: {
      "X-N8N-API-KEY": N8N_API_KEY,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch workflow: ${res.statusText}`);
  } else {
    console.log("Workflow fetched successfully");
  }

  return res.json();
}

export async function updateN8NWorkflow(id: string, data: Partial<N8NWorkflow>) {
  const res = await fetch(`${N8N_API_URL}/workflows/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-N8N-API-KEY": N8N_API_KEY,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Failed to update workflow: ${res.statusText}`);
  }

  return res.json();
}
