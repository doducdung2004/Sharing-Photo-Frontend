import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Typography, CircularProgress, Box } from "@mui/material";

import Home from "./Home/Home";
import TopBar from "./components/TopBar";
import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";
import UserPhotos from "./components/UserPhotos";
import Login from "./Account/Login";
import Register from "./Account/Register";
import ForgotPassword from "./Account/ForgotPassword";
import Form from "./components/TopBar/Form";
import UpdateProfile from "./components/UserList/UpdateProfile";

import "./App.css";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const RequireAuth = ({ user }) => {
  if (user === null) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const App = () => {
  const [user, setUser] = useState(undefined); // undefined: chưa tải, null: không có user
  const [loading, setLoading] = useState(true);

  const logOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/current_user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        // Nếu backend dùng cookie xác thực:
        // credentials: "include",
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Fetch current user error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  if (loading) {
    return (
      <Box sx={{ mt: 10, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <TopBar user={user} onLogout={logOut} />
      <div className="topbar-buffer" />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login onLogin={fetchCurrentUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login/forgotpass" element={<ForgotPassword />} />

        <Route element={<RequireAuth user={user} />}>
          <Route path="/form" element={<Form />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/users" element={<Home />}>
            <Route
              index
              element={<div>Chọn một người dùng để xem chi tiết</div>}
            />
            <Route path=":userId" element={<UserDetail />} />
            <Route path=":userId/photos" element={<UserPhotos />} />
          </Route>
        </Route>

        <Route
          path="*"
          element={
            <Typography variant="h6" color="error" align="center" sx={{ mt: 5 }}>
              404 - Trang không tồn tại
            </Typography>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
