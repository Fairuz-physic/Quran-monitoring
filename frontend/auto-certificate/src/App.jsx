import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./page_landing/landing";
import Register from "./register/register";
import Login from "./login/login";
import MainPage from "./dashboard/dashboard";
import AdminDash from "./dashboard/AdminDashboard";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/main"
        element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDash />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;