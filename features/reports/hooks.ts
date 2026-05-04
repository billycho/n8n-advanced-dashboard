import { useQuery } from "@tanstack/react-query";
import { getReports, getReport } from "./api";

export function useReports(agentId?: string) {
  return useQuery({
    queryKey: ["reports", agentId],
    queryFn: () => getReports(agentId),
  });
}

export function useReport(id: string) {
  return useQuery({
    queryKey: ["reports", id],
    queryFn: () => getReport(id),
    enabled: !!id,
  });
}
