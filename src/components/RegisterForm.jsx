import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RegisterForm.css"; // Import CSS file
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

      navigate("/errorRegistration", {
        state: {
          error: error.response?.data,
        },
      });
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Register</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="input"
        />
        <button type="submit" className="button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
