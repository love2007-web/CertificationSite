import {
  Container,
  Typography,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
  import React, { useRef, useState, useEffect } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import TextInput from "../../components/TextInput/TextInput";
  import Navbar from "../../components/Navbar/Navbar";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
  import ActionButton from "../../components/ActionButton/ActionButton";
  import axios from "axios";
  import { Toast } from 'primereact/toast';
  import "primereact/resources/themes/lara-light-cyan/theme.css";
  
  function SignupPage() {
	const toast = useRef(null);
  
	const [name, setName] = useState("");
	const [email, changeEmail] = useState("");
	// const [emailError, setEmailError] = useState("");
	const [emailChanged, setEmailChanged] = useState(false);
	const [password, changePassword] = useState("");
	// const [passwordError, setPasswordError] = useState("");
	const [passwordChanged, setPasswordChanged] = useState(false);
  
	const [showPassword, setShowPassword] = useState(false);
  
	// const [errorText, setErrorText] = useState(
	//   "Error Logging In! Try again...."
	// );
  
	const navigate = useNavigate();
  
	// const [notVerified, setNotVerified] = useState(false);
	// const [verifyMail, setVerifyMail] = useState("");
  
	const [isLoading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
  
	// const mailErrorText = "Email cannot be empty";
	// const passwordErrorText = "Password cannot be empty";
  
	const backend = process.env.REACT_APP_BACKEND_URL;
  
	const handleNameChange = (event) => {
	  setName(event.target.value);
	};
  
	const handleEmailChange = (event) => {
	  setEmailChanged(true);
	  changeEmail(event.target.value);
	};
  
	const handlePasswordChange = (event) => {
	  setPasswordChanged(true);
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
	  setLoading(true);
	  const url = `${backend}/user/signup`;
	  console.log(url);
  
	  let data = {
		name,
		email,
		password,
	  };
  
	  console.log(data);
  
	  try {
		await axios.post(url, data).then((res) => {
		  setLoading(false);
		  setSuccess(true);
		  console.log(res);
		});
	  } catch (error) {
		setLoading(false);
		toast.current.show({ severity: 'error', summary: 'Error', detail: error.response.data.message });
		changePassword("");
		console.log(error);
	  }
	};
  
	useEffect(() => {
	  if (success) {
		toast.current.show({ severity: 'success', summary: 'Success', detail: 'Signup successful!' });
		setTimeout(() => {
		  navigate("/login");
		}, 1000); // 2 seconds delay before navigating
	  }
	}, [success, navigate]);
  
	return (
	  <>
		<Navbar />
		<Container className="login-page">
		  <Typography variant="h3" color="primary" className="login-head">
			Sign Up
		  </Typography>
		  <form className="form">
			<TextInput
			  id="name"
			  label="Name"
			  type="text"
			  className="form-input"
			  variant="outlined"
			  value={name}
			  onChange={handleNameChange}
			/>
			<TextInput
			  id="email"
			  label="Email"
			  type="email"
			  className="form-input"
			  variant="outlined"
			  value={email}
			  onChange={handleEmailChange}
			/>
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
					  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
					</IconButton>
				  </InputAdornment>
				),
			  }}
			/>
		  </form>
		  <div className="login-btn-div">
			<ActionButton
			  className="login-btn"
			  onClick={handleSubmit}
			  disabled={isLoading ? true : false}
			>
			  {!isLoading ? "REGISTER" : <CircularProgress color="secondary" size={20} thickness={5} />}
			</ActionButton>
			<Typography variant="h6" color="primary" className="btn-seperator">
			  --- OR ---
			</Typography>
			<Link to={`/login`}>
			  <ActionButton className="transparent-variant">
				LOGIN
			  </ActionButton>
			</Link>
		  </div>
		</Container>
		<Toast ref={toast} />
	  </>
	);
  }
  
  export default SignupPage;
  