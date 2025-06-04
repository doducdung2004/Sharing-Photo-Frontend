import React, { useState, useEffect } from "react";
import {
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import "./styles.css";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

function UserList() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/user/list`);
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách người dùng:", error.message);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="user-list-container">
            <Typography variant="body1">Danh sách người dùng</Typography>
            <List component="nav">
                {data.map((item) => (
                    <React.Fragment key={item._id}>
                        <ListItem component={Link} to={`/users/${item._id}`}>
                            <ListItemText primary={`${item.first_name} ${item.last_name}`} />
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
        </div>
    );
}

export default UserList;
