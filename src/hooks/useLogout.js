import { useQueryClient, useMutation } from "@tanstack/react-query";
import { signOut } from "../services";
import toast from "react-hot-toast";

const useLogout = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Logout failed");
    },
  });

  return { 
    error, 
    isPending, 
    logoutMutation: mutate 
  };
};

export default useLogout;