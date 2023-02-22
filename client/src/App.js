import Dashboard from "./components/Dashboard";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import SystemSettings from "./components/SystemSettings/SystemSettings";
import ACDM from "./components/SystemSettings/Acdm";

function App() {
	return (
		<>
			<h1 className="App-header ">Zookeeper & SSV Demo</h1>
			<Routes>
				<Route path="/" element={<Dashboard />} />
				<Route path="/system-settings" element={<SystemSettings />} />
				<Route path="/system-settings/acdm" element={<ACDM />} />
				{/* <Route path="/system-settings/vtt" element={<VTT />} /> */}
				{/* <Route path="/system-settings/general" element={<General />} /> */}
			</Routes>
		</>
	);
}

export default App;
