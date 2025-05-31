import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import "./styles.css";
import { useParams, Link } from "react-router-dom";

function UserDetail() {
    const { userId } = useParams();  // lấy userId từ URL param
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:8081/api/user/${userId}`);
                if (!response.ok) {
                    throw new Error(`Lỗi khi tải người dùng: ${response.status}`);
                }
                const data = await response.json();
                setUser(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [userId]);

    if (loading) {
        return <Typography>Đang tải...</Typography>;
    }

    if (error) {
        return (
            <Typography variant="h6" color="error">
                {error}
            </Typography>
        );
    }

    if (!user) {
        return (
            <Typography variant="h6" color="error">
                Không tìm thấy người dùng với ID: {userId}
            </Typography>
        );
    }

    return (
        <>
            <div className="user-detail-container">
            <Typography variant="h6" gutterBottom>
                Thông tin chi tiết
            </Typography>
            <Typography variant="body1">
                <strong>Họ và tên:</strong> {user.first_name} {user.last_name}
            </Typography>
            <Typography variant="body1">
                <strong>ID:</strong> {user._id}
            </Typography>
            <Typography variant="body1">
                <strong>Vị trí:</strong> {user.location}
            </Typography>
            <Typography variant="body1">
                <strong>Mô tả:</strong> {user.description}
            </Typography>
            <Typography variant="body1">
                <strong>Nghề nghiệp:</strong> {user.occupation}
            </Typography>
            <Link to={`/users/${userId}/photos`}>Xem ảnh của người dùng</Link>
            </div>
        </>
    );
}

export default UserDetail;
