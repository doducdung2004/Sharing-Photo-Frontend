import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Tên đăng nhập hoặc mật khẩu không đúng.");
        } else if (response.status === 400) {
          setError("Vui lòng nhập đầy đủ thông tin đăng nhập.");
        } else {
          setError("Lỗi đăng nhập, vui lòng thử lại.");
        }
        return;
      }

      // Giả sử backend trả về { token: "jwt-token", user: {...} }
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        if (onLogin) await onLogin(); // gọi để fetch lại user info
        navigate("/users");
      } else {
        setError("Không nhận được token từ server.");
      }
    } catch (err) {
      setError("Không thể kết nối tới server.");
      console.error("Lỗi đăng nhập", err);
    }
  };

  const registerLogin = () => {
    navigate("/register");
  };

  return (
    <div className="container">
      <h2>Đăng nhập tài khoản</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button type="submit">Đăng nhập ngay</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="forgot">
        <Link to="/login/forgotpass">Quên mật khẩu</Link>
      </div>

      <div className="res-section">
        <p>Bạn chưa có tài khoản ?</p>
        <button onClick={registerLogin}>Đăng kí ngay</button>
      </div>
    </div>
  );
}
