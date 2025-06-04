import React, { useState, useEffect } from "react";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

function UpdateProfile() {
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        location: "",
        description: "",
        occupation: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${apiUrl}/api/user/me`, {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setForm({
                        first_name: data.first_name || "",
                        last_name: data.last_name || "",
                        location: data.location || "",
                        description: data.description || "",
                        occupation: data.occupation || "",
                    });
                }
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu người dùng:", err);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${apiUrl}/api/user/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Cập nhật thành công!");
            } else {
                alert("Lỗi: " + data.error);
            }
        } catch (err) {
            console.error(err);
            alert("Đã xảy ra lỗi.");
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
            <h2>Cập nhật thông tin cá nhân</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="first_name" placeholder="Họ" value={form.first_name} onChange={handleChange} /><br />
                <input type="text" name="last_name" placeholder="Tên" value={form.last_name} onChange={handleChange} /><br />
                <input type="text" name="location" placeholder="Địa điểm" value={form.location} onChange={handleChange} /><br />
                <input type="text" name="occupation" placeholder="Nghề nghiệp" value={form.occupation} onChange={handleChange} /><br />
                <textarea name="description" placeholder="Mô tả" value={form.description} onChange={handleChange} /><br />
                <button type="submit" style={{ marginTop: "10px" }}>Cập nhật</button>
            </form>
        </div>
    );
}

export default UpdateProfile;
