import { Route, Routes, Navigate } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddTask from "./pages/AddTask.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    console.log("⚙️ App mounted → checking auth...");
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log("🔄 Auth state changed:", { authUser, isCheckingAuth });
  }, [authUser, isCheckingAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!authUser ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={authUser ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/add-task" element={authUser ? <AddTask /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;