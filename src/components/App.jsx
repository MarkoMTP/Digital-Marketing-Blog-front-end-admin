import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();

  const handleClick1 = async () => {
    await navigate("/login");
  };

  const handleClick2 = async () => {
    await navigate("/register");
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Welcome</h1>
      <div style={buttonContainerStyle}>
        <button style={buttonStyle} onClick={handleClick1}>
          Login
        </button>
        <button style={buttonStyle} onClick={handleClick2}>
          Register
        </button>
      </div>
    </div>
  );
};

const containerStyle = {
  backgroundColor: "#001f3f", // dark blue
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  fontFamily: "Arial, sans-serif",
};

const headingStyle = {
  fontSize: "3rem",
  marginBottom: "2rem",
};

const buttonContainerStyle = {
  display: "flex",
  gap: "1rem",
};

const buttonStyle = {
  padding: "0.75rem 1.5rem",
  fontSize: "1rem",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default App;
