import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000); // 3 seconds

    return () => clearTimeout(timer); // cleanup
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-5xl font-bold mb-4 text-error">404</h1>
      <p className="text-xl mb-2">Page not found</p>
      <p className="text-sm text-gray-500">Redirecting to home in few seconds...</p>
    </div>
  );
};

export default NotFound;
