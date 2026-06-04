import { useQueryClient, useMutation } from "@tanstack/react-query";
import { signOut } from "../services";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // ✅ top level ng hook

  const { mutate, isPending, error } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message || "Logout failed");
    },
  });

  return {
    error,
    isPending,
    logoutMutation: mutate,
  };
};

export default useLogout;
