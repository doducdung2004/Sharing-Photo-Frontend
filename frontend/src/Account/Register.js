import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Register.css';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password || !confirmPassword) {
            setError("Vui lòng điền đầy đủ thông tin");
            return;
        }

        if (password !== confirmPassword) {
            setError("Mật khẩu không khớp");
            return;
        }

        try {
            const response = await fetch("http://localhost:8081/api/register", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, first_name: firstName }),
            });

            if (!response.ok) {
                setError("Đăng ký thất bại. Tên đăng nhập có thể đã tồn tại.");
                return;
            }

            alert("Đăng ký thành công! Hãy đăng nhập.");
            navigate('/login');
        } catch (err) {
            setError("Lỗi kết nối tới server.");
            console.error("Lỗi đăng ký", err);
        }
    };

    return (
        <div className="container">
            <h2>Đăng ký tài khoản</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Họ tên"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                />
                <button type="submit">Đăng ký</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
