import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signUp } from "../services";
import toast from "react-hot-toast";

const useSignUp = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Account created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Sign up failed");
    },
  });

  return { 
    isPending, 
    error, 
    signUpMutation: mutate 
  };
};

export default useSignUp;