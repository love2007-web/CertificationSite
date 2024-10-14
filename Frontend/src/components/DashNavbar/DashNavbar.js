//Copy of Navbar.js

import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import "./DashNavbar.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

function DashNavbar({ open, setOpen, back }) {
	const [name] = useState(localStorage.getItem("name").split(" ")[0]);

	return (
		<AppBar position="static" className="navbar" elevation={0}>
			<Toolbar className="nav-toolbar">
				{!back ? (
					<IconButton edge="start" onClick={() => setOpen(!open)}>
						{open ? (
							<CloseIcon
								className="nav-drawer-icon"
								fontSize="large"
							/>
						) : (
							<MenuIcon
								className="nav-drawer-icon"
								fontSize="large"
							/>
						)}
					</IconButton>
				) : (
					<Link to="/dashboard">
						<IconButton edge="start">
							<ArrowBackIcon className="nav-drawer-icon" />
						</IconButton>
					</Link>
				)}
				<img
					src="/assets/certify.svg"
					alt="brand logo"
					width={150}
					className="nav-logo m-right"
				/>
				<div className="nav-menu nav-name-tag">
					Welcome {name}
					<Avatar
						alt={`${name} profile pic`}
						src="./assets/default.png"
						className="profile-avatar"
					/>
				</div>
			</Toolbar>
		</AppBar>
	);
}

export default DashNavbar;
