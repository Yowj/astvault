import { useQueryClient, useMutation } from "@tanstack/react-query";
import { signIn } from "../services";
import toast from "react-hot-toast";

const useLogin = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Logged in successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Login failed");
    },
  });

  return { 
    loginMutation: mutate, 
    isPending, 
    error 
  };
};

export default useLogin;