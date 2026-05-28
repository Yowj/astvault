import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabasePinsAPI } from "../services";
import toast from "react-hot-toast";

export const usePins = (userId) => {
  const query = useQuery({
    queryKey: ["pins", userId],
    queryFn: supabasePinsAPI.getAll,
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    pinnedIds: new Set(query.data || []),
    pinsIsPending: query.isLoading,
  };
};

export const usePinTemplate = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: supabasePinsAPI.pin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pins"] });
      toast.success("Template pinned");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to pin template");
    },
  });

  return { pinTemplateMutate: mutate, pinTemplateIsPending: isPending };
};

export const useUnpinTemplate = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: supabasePinsAPI.unpin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pins"] });
      toast.success("Template unpinned");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to unpin template");
    },
  });

  return { unpinTemplateMutate: mutate, unpinTemplateIsPending: isPending };
};
