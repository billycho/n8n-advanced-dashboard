import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAIAgents, getAIAgent, createAIAgent, updateAIAgent, deleteAIAgent } from "./api";

export function useAIAgents() {
  return useQuery({
    queryKey: ["ai-agents"],
    queryFn: getAIAgents,
  });
}

export function useAIAgent(id: string) {
  return useQuery({
    queryKey: ["ai-agents", id],
    queryFn: () => getAIAgent(id),
    enabled: !!id,
  });
}

export function useCreateAIAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAIAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-agents"] });
    },
  });
}

export function useUpdateAIAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAIAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-agents"] });
    },
  });
}

export function useDeleteAIAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAIAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-agents"] });
    },
  });
}
