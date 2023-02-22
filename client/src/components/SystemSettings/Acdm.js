import React, { useEffect, useState } from "react";

const ACDM = () => {
	const [acdmSettings, setAcdmSettings] = useState({});
	console.log("acdmSettings: ", acdmSettings);

	useEffect(() => {
		async function fetchSettings() {
			const response = await fetch("http://localhost:5000/systemSettings/acdm");
			const data = await response.json();
			setAcdmSettings(data);
		}
		fetchSettings();
	}, []);

	const handleInputChange = (e) => {
		setAcdmSettings((prevSettings) => ({ ...prevSettings, [`${e.target.name}`]: e.target.value }));
	};

	const handleSave = async (param) => {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ value: acdmSettings[param] }),
		};
		const response = await fetch(`http://localhost:5000/systemSettings/acdm/${param}`, requestOptions);
		const data = await response.json();
		console.log("data: ", data);
	};

	return (
		<div className="cards-container">
			<h2>ACDM</h2>
			<div>
				<div className="settings-card">
					<h3>X</h3>
					<input className="input" type="text" name="X" value={acdmSettings.X} onChange={handleInputChange} />
					<button className="btn" onClick={() => handleSave("X")}>
						Save
					</button>
				</div>
				<div className="settings-card">
					<h3>tobtConfirmation</h3>
					<input
						className="input"
						type="text"
						name="tobtConfirmation"
						value={acdmSettings.tobtConfirmation}
						onChange={handleInputChange}
					/>
					<button className="btn" onClick={() => handleSave("tobtConfirmation")}>
						Save
					</button>
				</div>
				<div className="settings-card">
					<h3>tsatMargin</h3>
					<input className="input" type="text" name="tsatMargin" value={acdmSettings.tsatMargin} onChange={handleInputChange} />
					<button className="btn" onClick={() => handleSave("tsatMargin")}>
						Save
					</button>
				</div>
			</div>
		</div>
	);
};

export default ACDM;
