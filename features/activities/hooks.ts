import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getActivities, syncActivities, getN8nExecutions, getActivity } from "./api";

export function useActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: () => getActivities(),
  });
}

export function useN8nExecutions() {
  return useQuery({
    queryKey: ["n8n-executions"],
    queryFn: () => getN8nExecutions(),
    // We don't want to refetch this constantly
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useSyncActivities() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (executions: any[]) => syncActivities(executions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
}

export function useActivity(id: string) {
  return useQuery({
    queryKey: ["activities", id],
    queryFn: () => getActivity(id),
    enabled: !!id,
  });
}
