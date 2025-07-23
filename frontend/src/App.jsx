import { Route, Routes, Navigate } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx"; // New import
import InstructorDashboard from "./pages/InstructorDashboard.jsx"; // New import
import { useAuthStore } from "./store/useAuthStore.js";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import ThemeSwitcher from "./components/theme-switcher.jsx";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    console.log("⚙️ App mounted → checking auth...");
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log("🔄 Auth state changed:", { authUser, isCheckingAuth });
  }, [authUser, isCheckingAuth]);

  if (isCheckingAuth)
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <Loader className="size-10 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!authUser ? <Home /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!authUser ? <Register /> : <Navigate to="/dashboard" />} />

        {/* Protected Dashboard Route - Renders based on role */}
        <Route
          path="/dashboard"
          element={
            authUser ? (
              authUser.role === 'student' ? (
                <StudentDashboard />
              ) : (
                <InstructorDashboard />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>

      <Toaster />
      <ThemeSwitcher />
    </div>
  );
}

export default App;
