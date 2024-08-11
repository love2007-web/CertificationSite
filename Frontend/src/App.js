import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import ErrorPage from "./pages/ErrorPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import LoginPage from "./pages/Login/LoginPage";
import SignupPage from "./pages/Login/SignupPage";
import EventPage from "./pages/EventPage/EventPage";
import VerifyPage from "./pages/VerifyPage/VerifyPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";

function App() {
	return (
		<Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<SignupPage />} />
                <Route path="/event/:id" element={<EventPage />} />
                <Route path="/verify" element={<VerifyPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </Router>
	);
}

export default App;
