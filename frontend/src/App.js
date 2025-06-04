import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Typography } from "@mui/material";

import Home from "./Home/Home";
import TopBar from "./components/TopBar";
import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";
import UserPhotos from "./components/UserPhotos";
import Login from "./Account/Login";
import Register from "./Account/Register";
import ForgotPassword from "./Account/ForgotPassword";
import Form from "./components/TopBar/Form";
import "./App.css";
import UpdateProfile from "./components/UserList/UpdateProfile";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const RequireAuth = ({ user }) => {
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};

const App = () => {
    const [user, setUser] = useState(null);

    const logOut = async () => {
        try {
            const res = await fetch(`${apiUrl}/api/logout`, {
                method: "POST",
                credentials: "include",
            });
            if (res.ok) {
                setUser(null);
            } else {
                alert("Logout thất bại");
            }
        } catch (err) {
            console.error("Logout error:", err);
            alert("Logout thất bại");
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const res = await fetch(`${apiUrl}/api/current_user`, {
                method: "GET",
                credentials: "include",
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
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

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
                        <Route index element={<div>Chọn một người dùng để xem chi tiết</div>} />
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
