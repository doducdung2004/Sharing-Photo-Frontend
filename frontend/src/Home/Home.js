import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./Home.css";
import UserList from "../components/UserList";
const Home = () => {
    return (
        <div className="home-container">
            <div className="user-list-panel">
                <UserList/>
            </div>
            <div className="user-detail-panel">
                <Outlet />
            </div>
        </div>
    );
};

export default Home;
