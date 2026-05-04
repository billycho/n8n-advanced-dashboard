import { Report } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function getReports(agentId?: string): Promise<Report[]> {
  const url = agentId 
    ? `${API_URL}/api/reports?agentId=${agentId}` 
    : `${API_URL}/api/reports`;
  const res = await fetch(url);
  return res.json();
}

export async function getReport(id: string): Promise<Report> {
  const res = await fetch(`${API_URL}/api/reports/${id}`);
  return res.json();
}
