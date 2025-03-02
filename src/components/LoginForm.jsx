import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/LoginForm.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      const token = response.data.token;
      if (token) {
        localStorage.setItem("token", token);
        navigate("/posts");
      } else {
        const msg = "No token received";
        navigate("/error", {
          state: {
            error: msg,
          },
        });
      }
    } catch (err) {
      console.log(err);
      navigate("/error", {
        state: {
          error: err.response?.data,
        },
      });
    }
  };
  return (
    <div className="container">
      <h2 className="heading">Login Form</h2>
      <form onSubmit={handleSubmit} className="form">
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
        <button type="submit" className="button">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
