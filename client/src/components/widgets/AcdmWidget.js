import React, { useState, useEffect } from "react";

function AcdmWidget() {
	const [settings, setSettings] = useState({});
	// console.log('settings: ', settings);

	useEffect(() => {
		const eventSource = new EventSource("http://localhost:5000");

		eventSource.onmessage = (event) => {
			console.log("event.data: ", event.data);
			const updatedSetting = JSON.parse(event.data);
			setSettings((prevSettings) => ({ ...prevSettings, ...updatedSetting.data }));
		};

		eventSource.onerror = function () {
			setSettings("Server closed connection");
			eventSource.close();
		};

		return () => {
			eventSource.close();
		};
	}, []);

	return (
		<div>
			<h2 style={{ textAlign: "center" }}>ACDM Widget</h2>
			<ul>
				{Object.entries(settings).map(([key, value]) => (
					<li style={{ listStyleType: "none" }} key={key}>
						{key}: {JSON.stringify(value)}
					</li>
				))}
			</ul>
		</div>
	);
}

export default AcdmWidget;
