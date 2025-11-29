import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginForm.css";
import api from "../api";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", { email, password });

      const token = response.data.token;
      if (token) {
        await localStorage.setItem("token", token); // ✅ Store token
        navigate("/homepage");
      } else {
        const message = "Invalid email or password.";
        setErrorMsg(message);
        console.error("No token received!");
      }
    } catch (error) {
      const message =
        error.response?.data?.error || "Invalid email or password.";
      setErrorMsg(message);
    }
  };

  const handleGoBack = () => navigate("/");

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-heading">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="login-form">
          {errorMsg && <p className="login-error">{errorMsg}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <button onClick={handleGoBack} className="go-back">
          Go Back
        </button>
      </div>
    </div>
  );
}

export default LoginForm;
