
import { Container, Typography, InputAdornment, IconButton, CircularProgress } from "@mui/material";
import React, { useState, useEffect, useRef} from "react";
import { Link, useNavigate } from "react-router-dom";
import TextInput from "../../components/TextInput/TextInput";
import Navbar from "../../components/Navbar/Navbar";
import "./LoginPage.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ActionButton from "../../components/ActionButton/ActionButton";
import axios from "axios";
import { Toast } from 'primereact/toast';
import "primereact/resources/themes/lara-light-cyan/theme.css";

function LoginPage() {
	const toast = useRef(null);

	const [email, changeEmail] = useState("");
	// const [emailError, setEmailError] = useState("");
	const [emailChanged, setEmailChanged] = useState(false);
	const [password, changePassword] = useState("");
	// const [passwordError, setPasswordError] = useState("");
	const [passwordChanged, setPasswordChanged] = useState(false);

	const [showPassword, setShowPassword] = useState(false);

	// const [errorText, setErrorText] = useState(
	// 	"Error Logging In! Try again...."
	// );
	// const [redirect, setRedirect] = useState(false);
	// const [ownerRedirect, setOwnerRedirect] = useState(false);
	// const [loginRedirect, setLoginRedirect] = useState(false);

	// const [notVerified, setNotVerified] = useState(false);
	// const [verifyMail, setVerifyMail] = useState("");
	const navigate = useNavigate();

	const [isLoading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	// const mailErrorText = "Email cannot be empty";
	// const passwordErrorText = "Password cannot be empty";

	const backend = "https://certification-project-backend-ayzx.onrender.com";

	const handleEmailChange = (event) => {
		setEmailChanged(true);
		console.log(emailChanged);
		
		changeEmail(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPasswordChanged(true);
		console.log(passwordChanged);
		
		changePassword(event.target.value);
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const keyPress = (event) => {
		if (event.key === "Enter") {
			handleSubmit();
		}
	};

	const handleSubmit = async () => {
		const url = `${backend}/user/login`;
		setLoading(true);

		const data = {
			email,
			password,
		};

		console.log(data, url);
		try {
			await axios.post(url, data).then((res) => {
				console.log(res);
				localStorage.setItem("authToken", res.data.token);
				localStorage.setItem("name", res.data.userDetails.name);
				setLoading(false);
				setSuccess(true);
			});
		} catch (error) {
			console.log(error);
			toast.current.show({ severity: 'error', summary: 'Error', detail: error.response.data.message });
			changePassword("");
			setLoading(false);
		}
	};

	useEffect(() => {
		if (success) {
		  toast.current.show({ severity: 'success', summary: 'Success', detail: 'Login successful!' });
		  setTimeout(() => {
			navigate("/dashboard");
		  }, 1000); // 2 seconds delay before navigating
		}
	  }, [success, navigate]);

	return (
		<>
			<Navbar />
			<Container className="login-page">
				<Typography variant="h3" color="primary" className="login-head">
					LOGIN
				</Typography>
				<form className="form">
					<TextInput
						id="email"
						label="Email"
						type="email"
						className="form-input"
						variant="outlined"
						value={email}
						onChange={handleEmailChange}
					></TextInput>
					<br />
					<TextInput
						id="password"
						type={showPassword ? "text" : "password"}
						label="Password"
						className="form-input"
						variant="outlined"
						value={password}
						onChange={handlePasswordChange}
						onKeyPress={keyPress}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="show password"
										onClick={togglePasswordVisibility}
										edge="end"
										className="view-pass-icon"
									>
										{showPassword ? (
											<VisibilityIcon />
										) : (
											<VisibilityOffIcon />
										)}
									</IconButton>
								</InputAdornment>
							),
						}}
					></TextInput>
				</form>
				<br />
				<div className="login-btn-div">
					<ActionButton
						className="login-btn"
						onClick={handleSubmit}
						disabled={isLoading ? true : false}
					>
						{!isLoading ? (
							"LOGIN"
						) : (
							<CircularProgress
								color="secondary"
								size={20}
								thickness={5}
							/>
						)}
					</ActionButton>
					<Typography
						variant="h6"
						color="primary"
						className="btn-seperator"
					>
						--- OR ---
					</Typography>
					<Link to={`/register`}>
						<ActionButton className="transparent-variant">
							Register
						</ActionButton>
					</Link>
				</div>
			</Container>
			<Toast ref={toast} />
		</>
	);
}

export default LoginPage;
