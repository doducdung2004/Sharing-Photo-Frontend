import React, { useState, useEffect } from "react";
import {
    Typography,
    Card,
    CardMedia,
    CardContent,
    Button,
} from "@mui/material";
import { useParams } from "react-router-dom";
import "./styles.css";
const apiUrl = process.env.REACT_APP_BACKEND_URL;

function UserPhotos() {
    const { userId } = useParams();
    const [photos, setPhotos] = useState([]);
    const [name, setName] = useState("");
    const [comments, setComments] = useState({});

    const fetchPhotos = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/photo/photoOfUsers/${userId}`);
            if (!response.ok) {
                throw new Error(`HTTP status ${response.status}`);
            }
            const result = await response.json();
            setPhotos(result);
        } catch (error) {
            console.error("Không thể tải ảnh:", error);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/user/${userId}`);
            if (!response.ok) throw new Error(`HTTP status ${response.status}`);
            const result = await response.json();
            setName(result.first_name);
        } catch (error) {
            console.error("Không thể tải thông tin người dùng:", error);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchPhotos();
    }, [userId]);

    const onUploadSuccess = () => {
        fetchPhotos();
    };

    const handleCommentChange = (photoId, value) => {
        setComments((prev) => ({
            ...prev,
            [photoId]: value,
        }));
    };

    const handleSubmit = async (photoId) => {
        const comment = comments[photoId];
        if (!comment || comment.trim() === "") return;

        try {
            const response = await fetch(
                `${apiUrl}/api/commentsOfPhoto/${photoId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ comment }),
                }
            );
            if (!response.ok) throw new Error(`HTTP status ${response.status}`);

            await fetchPhotos();
            setComments((prev) => ({ ...prev, [photoId]: "" }));
        } catch (error) {
            console.error("Không thể bình luận", error);
        }
    };

    return (
        <div className="user-photos-container">
            <Typography variant="h6" gutterBottom>
                Ảnh của: {name}
            </Typography>

            <div className="newsfeed-container">
                {photos.map((photo) => (
                    <Card className="newsfeed-card" key={photo._id}>
                        <CardMedia
                            component="img"
                            image={`${apiUrl}/uploads/${photo.file_name}`}
                            alt={`Ảnh ${photo._id}`}
                        />
                        <CardContent>
                            <Typography variant="body2" color="textSecondary">
                                Được đăng lúc: {photo.date_time}
                            </Typography>
                            {photo.comments && photo.comments.length > 0 && (
                                <>
                                    <Typography variant="subtitle2">Bình luận:</Typography>
                                    {photo.comments.map((comment, index) => (
                                        <Typography variant="body2" key={index}>
                                            <strong>
                                                {comment.user_id
                                                    ? `${comment.user_id.first_name} ${comment.user_id.last_name}`.trim()
                                                    : "Người dùng"}
                                                :
                                            </strong>{" "}
                                            {comment.comment}
                                        </Typography>
                                    ))}
                                </>
                            )}

                            <div className="newComment">
                                <input
                                    type="text"
                                    value={comments[photo._id] || ""}
                                    onChange={(e) =>
                                        handleCommentChange(photo._id, e.target.value)
                                    }
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleSubmit(photo._id)}
                                >
                                    Đăng
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default UserPhotos;
