import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import "./styles.css";
import { useNavigate } from "react-router-dom";

function TopBar({ user, onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (onLogout) onLogout();
        navigate("/login");
    };

    const handlePhoto = (e) => {
        e.preventDefault();
        navigate("/form");
    };

    return (
        <AppBar className="topbar" position="absolute">
            <Toolbar>
                <Typography variant="h5" color="inherit" sx={{ flexGrow: 1 }}>
                    {user && user.username   ? `Hi ${user.username}` : "Trang chủ"}
                </Typography>

                {user && user.username  && (
                    <>
                        <Button color="inherit" onClick={() => navigate("/update-profile")}>
                            Cập nhật thông tin
                        </Button>
                        <Button color="inherit" onClick={handlePhoto}>
                            Thêm ảnh mới
                        </Button>
                        <Button color="inherit" onClick={handleLogout}>
                            Đăng xuất
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default TopBar;
