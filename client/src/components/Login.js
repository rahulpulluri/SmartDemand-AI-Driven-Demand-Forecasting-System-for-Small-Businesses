import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import smallBusinessDiagram from "../assets/images/small-business-diagram.jpeg"; // Import the image

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // For navigation

  // Handle login when form is submitted
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        process.env.REACT_APP_AUTH_API_ENDPOINT + "/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Store the JWT token
        localStorage.setItem("token", data.token);

        // Store the username in local storage
        localStorage.setItem("username", username);

        // Navigate to the dashboard
        navigate("/dashboard");
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-field">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <p className="input-hint">Sample username: user1</p>
          </div>
          <div className="input-field">
            <label>Password</label>
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="input-hint">Sample password: User1@123</p>
            <i className="toggle-password" onClick={togglePasswordVisibility}>
              {passwordVisible ? "🙈" : "👁️"}
            </i>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button className="login-btn" type="submit">
            Login
          </button>
        </form>
      </div>
      <div className="welcome-banner">
        <h1>Welcome to</h1>
        <h2>SmartDemand Portal</h2>
        <div className="banner-image">
          <img src={smallBusinessDiagram} alt="Small Business Diagram" />
        </div>
      </div>
    </div>
  );
};

export default Login;
