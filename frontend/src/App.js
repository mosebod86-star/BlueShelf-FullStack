import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("blueshelf_user")) || null; }
    catch { return null; }
  });

  function handleLogin(result) {
    localStorage.setItem("blueshelf_token", result.token);
    localStorage.setItem("blueshelf_user", JSON.stringify(result.user));
    setUser(result.user);
  }

  function handleLogout() {
    localStorage.removeItem("blueshelf_token");
    localStorage.removeItem("blueshelf_user");
    setUser(null);
  }

  return <>
    {user && <Navbar user={user} onLogout={handleLogout} />}
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} />
      <Route path="/" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
      <Route path="/books" element={<ProtectedRoute user={user}><Books /></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute user={user}><Transactions /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute user={user}>{user?.role === "MEMBER" ? <Navigate to="/" replace /> : <Users />}</ProtectedRoute>} />
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
    <footer className="footer">© {new Date().getFullYear()} BlueShelf Library Management System</footer>
  </>;
}
