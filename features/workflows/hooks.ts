import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getN8NWorkflow, updateN8NWorkflow } from "./api";
import { N8NWorkflow, WorkflowAssignment, WorkflowInterval } from "./types";

export function useN8NWorkflow(id: string) {
  return useQuery({
    queryKey: ["n8n-workflow", id],
    queryFn: () => getN8NWorkflow(id),
    enabled: !!id,
  });
}

export function useUpdateN8NWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<N8NWorkflow> }) =>
      updateN8NWorkflow(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["n8n-workflow", variables.id] });
    },
  });
}

// Helper to extract data from workflow
export function extractWorkflowData(workflow: N8NWorkflow) {
  const active = workflow.active;

  const setNode = workflow.nodes.find((n) => n.type === "n8n-nodes-base.set");
  const parameters: WorkflowAssignment[] = setNode?.parameters?.assignments?.assignments || [];

  const scheduleNode = workflow.nodes.find((n) => n.type === "n8n-nodes-base.scheduleTrigger");
  const cronExpression: string = scheduleNode?.parameters?.rule?.interval?.[0]?.expression || "";

  return {
    active,
    parameters,
    cronExpression,
    setNodeId: setNode?.id,
    scheduleNodeId: scheduleNode?.id,
  };
}
