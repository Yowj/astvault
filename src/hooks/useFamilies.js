import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseFamiliesAPI } from "../services";
import toast from "react-hot-toast";

export const useUserFamilies = () => {
  const query = useQuery({
    queryKey: ["families"],
    queryFn: supabaseFamiliesAPI.getUserFamilies,
  });

  return {
    families: query.data || [],
    familiesIsPending: query.isLoading,
    familiesIsError: query.isError,
  };
};

export const useFamilyMembers = (familyId) => {
  const query = useQuery({
    queryKey: ["family-members", familyId],
    queryFn: () => supabaseFamiliesAPI.getFamilyMembers(familyId),
    enabled: !!familyId,
  });

  return {
    members: query.data || [],
    membersIsPending: query.isLoading,
  };
};

export const useCreateFamily = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: supabaseFamiliesAPI.createFamily,
    onSuccess: (family) => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
      toast.success(`Family "${family.name}" created! Code: ${family.invite_code}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create family");
    },
  });

  return { createFamilyMutate: mutate, createFamilyIsPending: isPending };
};

export const useJoinFamily = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: supabaseFamiliesAPI.joinFamilyByCode,
    onSuccess: (family) => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success(`Joined "${family.name}" successfully!`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to join family");
    },
  });

  return { joinFamilyMutate: mutate, joinFamilyIsPending: isPending };
};

export const useLeaveFamily = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: supabaseFamiliesAPI.leaveFamily,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success("Left family successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to leave family");
    },
  });

  return { leaveFamilyMutate: mutate, leaveFamilyIsPending: isPending };
};

export const useDeleteFamily = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: supabaseFamiliesAPI.deleteFamily,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success("Family deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete family");
    },
  });

  return { deleteFamilyMutate: mutate, deleteFamilyIsPending: isPending };
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ familyId, userId }) =>
      supabaseFamiliesAPI.removeMember(familyId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["family-members", variables.familyId],
      });
      toast.success("Member removed");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove member");
    },
  });

  return { removeMemberMutate: mutate, removeMemberIsPending: isPending };
};

export const useRegenerateInviteCode = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: supabaseFamiliesAPI.regenerateInviteCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
      toast.success("New invite code generated");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to regenerate invite code");
    },
  });

  return { regenerateCodeMutate: mutate, regenerateCodeIsPending: isPending };
};
