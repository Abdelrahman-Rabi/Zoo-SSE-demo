import React from "react";
import { Link } from "react-router-dom";

const SystemSettings = () => {
	return (
		<div className="category-container">
			<h2>Dashboard</h2>
			<div className="category-card-container">
				<Link to="/system-settings/acdm">
					<button className="btn-card">ACDM</button>
				</Link>
				<Link to="/system-settings/vtt">
					<button className="btn-card">VTT</button>
				</Link>
				<Link to="/system-settings/general">
					<button className="btn-card">General</button>
				</Link>
			</div>
		</div>
	);
};

export default SystemSettings;
