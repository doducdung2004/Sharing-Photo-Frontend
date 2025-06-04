import React, { useState } from "react";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

function Form() {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            alert("Vui lòng chọn một ảnh để upload.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("photo", image);

            const response = await fetch(`${apiUrl}/api/photo/new`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            if (response.ok) {
                alert("Tải ảnh thành công!");
            } else {
                const errText = await response.text();
                alert("Upload thất bại: " + errText);
            }
        } catch (error) {
            console.error("Lỗi khi upload:", error);
            alert("Đã xảy ra lỗi khi upload.");
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
            <form onSubmit={handleSubmit}>
                <h2>Upload Ảnh</h2>
                <input type="file" name="photo" accept="image/*" onChange={handleImageChange} />
                {preview && (
                    <div style={{ marginTop: "10px" }}>
                        <p>Ảnh xem trước:</p>
                        <img
                            src={preview}
                            alt="Preview"
                            style={{ width: "100%", borderRadius: "8px" }}
                        />
                    </div>
                )}
                <button type="submit" style={{ marginTop: "10px" }}>
                    Upload
                </button>
            </form>
        </div>
    );
}

export default Form;
