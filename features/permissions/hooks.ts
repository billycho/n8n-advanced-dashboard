import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getClientPermissions, assignPermission, unassignPermission, clearPermissions } from "./api";
import { toast } from "sonner";

export function useClientPermissions(clientId: string) {
  return useQuery({
    queryKey: ["permissions", clientId],
    queryFn: () => getClientPermissions(clientId),
    enabled: !!clientId,
  });
}

export function useAssignPermission(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions", clientId] });
      toast.success("Permission assigned successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to assign permission");
    }
  });
}

export function useUnassignPermission(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unassignPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions", clientId] });
      toast.success("Permission removed successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to unassign permission");
    }
  });
}

export function useClearPermissions(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearPermissions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions", clientId] });
      toast.success("All permissions cleared successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to clear permissions");
    }
  });
}
