import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../services";

const useAuthUser = () => {
  const authQuery = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { 
    isPending: authQuery.isPending, 
    authUser: authQuery.data?.user,
    error: authQuery.error,
    refetch: authQuery.refetch
  };
};

export default useAuthUser;