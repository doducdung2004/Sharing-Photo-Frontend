import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './ForgotPassword.css';

const apiUrl = process.env.REACT_APP_BACKEND_URL;

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email) {
            setError("Vui lòng nhập email");
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/api/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                setError("Không tìm thấy email hoặc lỗi server.");
                return;
            }

            setMessage("Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.");
        } catch (err) {
            setError("Không thể kết nối tới server.");
            console.error("Lỗi quên mật khẩu", err);
        }
    };

    return (
        <div className="container">
            <h2>Quên mật khẩu</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <button type="submit">Gửi yêu cầu</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}
        </div>
    );
}
