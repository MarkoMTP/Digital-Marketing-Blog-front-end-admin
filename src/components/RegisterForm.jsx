import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RegisterForm.css";
import api from "../api";

function RegisterForm() {
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("register/admin", {
        userName,
        email,
        password,
        confirmPassword,
      });
      navigate("/registrationSuccess");
    } catch (error) {
      console.log(error);
      navigate("/error", {
        state: { error: error.response?.data },
      });
    }
  };

  const handleGoBack = () => navigate("/");

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-heading">Create Your Account</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="register-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="register-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="register-input"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="register-input"
          />
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
        <button onClick={handleGoBack} className="go-back">
          Go Back
        </button>
      </div>
    </div>
  );
}

export default RegisterForm;
