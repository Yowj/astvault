import Navbar from "./components/Navbar";
import { Route, Routes, Navigate, useLocation } from "react-router";
import { Loader } from "lucide-react";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ProfilePage from "./pages/ProfilePage";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Ai from "./pages/Ai_grammar";
import AiChat from "./pages/Ai_chat";
import useAuthUser from "./hooks/useAuthUser";

const App = () => {
  const { authUser: user, isPending: loading } = useAuthUser();
  const location = useLocation();

  // Hide navbar on landing page
  const isLandingPage = location.pathname === "/";

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
      {!isLandingPage && <Navbar />}
      <main className={`flex-1 relative ${isLandingPage ? '' : ''}`}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />
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
