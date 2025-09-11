import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseTemplatesAPI } from '../services';
import toast from "react-hot-toast";

export const useTemplates = () => {
  const templatesQuery = useQuery({
    queryKey: ["templates"],
    queryFn: supabaseTemplatesAPI.getAll,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  return {
    templates: templatesQuery.data || [],
    templatesIsPending: templatesQuery.isLoading,
    templatesIsError: templatesQuery.isError,
    templatesError: templatesQuery.error,
    refetch: templatesQuery.refetch,
  };
};

export const useTemplate = (id) => {
  const templateQuery = useQuery({
    queryKey: ["template", id],
    queryFn: () => supabaseTemplatesAPI.getById(id),
    enabled: !!id, // Only fetch if id exists
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    template: templateQuery.data,
    templateIsPending: templateQuery.isLoading,
    templateIsError: templateQuery.isError,
    templateError: templateQuery.error,
    refetch: templateQuery.refetch,
  };
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: supabaseTemplatesAPI.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success(data.message || "Template created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create template");
    },
  });

  return { 
    createTemplateMutate: mutate, 
    createTemplateIsPending: isPending, 
    createTemplateError: error 
  };
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: supabaseTemplatesAPI.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      queryClient.invalidateQueries({ queryKey: ["template", variables.id] });
      toast.success(data.message || "Template updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update template");
    },
  });

  return { 
    updateTemplateMutate: mutate, 
    updateTemplateIsPending: isPending, 
    updateTemplateError: error 
  };
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: supabaseTemplatesAPI.delete,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success(data.message || "Template deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete template");
    },
  });

  return { 
    deleteTemplateMutate: mutate, 
    deleteTemplateIsPending: isPending, 
    deleteTemplateError: error 
  };
};

export const useAskAI = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: (prompt) => supabaseTemplatesAPI.askAI(prompt),
    onSuccess: () => {
      toast.success("AI request successful");
    },
    onError: (error) => {
      toast.error(error.message || "AI request failed");
    },
  });

  return { 
    askAIMutate: mutate, 
    askAIIsPending: isPending, 
    askAIError: error 
  };
};

export const useGrammarEnhance = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: (text) => supabaseTemplatesAPI.grammarEnhance(text),
    onSuccess: () => {
      toast.success("Grammar enhancement successful");
    },
    onError: (error) => {
      toast.error(error.message || "Grammar enhancement failed");
    },
  });

  return { 
    grammarEnhanceMutate: mutate, 
    grammarEnhanceIsPending: isPending, 
    grammarEnhanceError: error 
  };
};