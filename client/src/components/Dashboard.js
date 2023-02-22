import React from "react";
import { Link } from "react-router-dom";
import "./main.css";
import AcdmWidget from "./widgets/AcdmWidget";
const Dashboard = () => {
	return (
		<div className="dashboard-container">
			<h1>Dashboard</h1>
			<div className="widgets-container">
				<div className="widget-container">
                    <AcdmWidget />
                </div>
				<div className="widget-container">VTT</div>
			</div>
			<Link to="/system-settings">
				<button className="btn">System Settings</button>
			</Link>
		</div>
	);
};

export default Dashboard;
