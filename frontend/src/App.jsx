import Navbar from "./components/Navbar";
import { Route, Routes, Navigate } from "react-router";
import { Loader } from "lucide-react";
import NotFound from "./pages/NotFound";
import Login from "./components/auth/Login";
import ProfilePage from "./components/auth/ProfilePage";
import Home from "./pages/Home";
import Ai from "./pages/Ai";
import AiChat from "./pages/AiChat";
import useAuthUser from "./hooks/useAuthUser";

const App = () => {
  const { authUser: user, isPending: loading } = useAuthUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-base-content/60">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />
      <main className="flex-1 relative">
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/grammar-enhancer" element={user ? <Ai /> : <Navigate to="/login" />} />
          <Route path="/askAi" element={user ? <AiChat /> : <Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
