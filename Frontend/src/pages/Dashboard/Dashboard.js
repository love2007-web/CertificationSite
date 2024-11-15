import Drawer from "@mui/material/Drawer";
import Axios from "axios";
import React, { useEffect, useState, useCallback } from "react"; // Import useCallback
import { useNavigate } from "react-router-dom";
import DashNavbar from "../../components/DashNavbar/DashNavbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Loading from "../Loading/Loading";
import MyCertificates from "../MyCertificates/MyCertificates";
import MyEvents from "../MyEvents/MyEvents";
import "./Dashboard.css";

function Dashboard() {
	const [isLoggedIn, setLoggedIn] = useState(false);
	const [loading, setLoading] = useState(true);
	const [refresh, setRefresh] = useState(false);
	const navigate = useNavigate();

	const [name, setName] = useState("");
	const [certEvents, setCertEvents] = useState([]);
	const [createdEvents, setCreatedEvents] = useState([]);
	const [openDash, setOpenDash] = useState(1);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const drawerWidth = 256;

	const backend = "http://localhost:5000";

	// Wrap getCertificates in useCallback
	const getCertificates = useCallback(async () => {
		setLoading(true);
		let url = `${backend}/user/events`;
		let token = localStorage.getItem("authToken");

		try {
			const res = await Axios.get(url, {
				headers: {
					"auth-token": token,
				},
			});

			console.log(res.data);
			const certs = [];
			const created = [];

			res.data.events.forEach((event) => {
				if (event.is_admin) {
					created.push(event);
				} else {
					certs.push(event);
				}
			});
			console.log(created);
			setCertEvents(certs);
			setCreatedEvents(created);
		} catch (error) {
			console.log(error);
			// Handle error, if necessary
		} finally {
			setLoading(false);
		}
	}, [backend]); // Add backend to the dependency array

	useEffect(() => {
	  console.log(createdEvents);
	}, [createdEvents])
	

	useEffect(() => {
		const token = localStorage.getItem("authToken");
		if (token) {
			setLoggedIn(true);
			setName(localStorage.getItem("name"));
			getCertificates();
		} else {
			setLoggedIn(false);
		}
	}, [getCertificates]); // Add getCertificates as a dependency

	useEffect(() => {
		if (refresh) getCertificates();
	}, [refresh, getCertificates]);

	if (loading) {
		return <Loading />;
	}

	if (!isLoggedIn) {
		navigate("/");
		return null; // Prevent rendering if not logged in
	}

	return (
		<div
			className="dashboard-page"
			style={{ marginLeft: drawerOpen ? `${drawerWidth}px` : 0 }}
		>
			<DashNavbar open={drawerOpen} setOpen={setDrawerOpen} />
			<Drawer
				variant="persistent"
				anchor="left"
				open={drawerOpen}
				className="dash-drawer"
				style={{ width: `${drawerWidth}px` }}
			>
				<Sidebar
					name={name}
					setOpenDash={setOpenDash}
					openDash={openDash}
					setLoggedIn={setLoggedIn}
				/>
			</Drawer>
			<div className="dash-screen">
				<TabPanel value={openDash} index={1}>
					<MyCertificates events={createdEvents} />
				</TabPanel>
				<TabPanel value={openDash} index={2}>
					<MyEvents events={createdEvents} setRefresh={setRefresh} />
				</TabPanel>
			</div>
		</div>
	);
}

export default Dashboard;

function TabPanel(props) {
	const { children, value, index, ...other } = props;
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
			style={{ height: "100%" }}
		>
			{value === index && <div>{children}</div>}
		</div>
	);
}
