import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();

  const handleClick1 = () => navigate("/login");
  const handleClick2 = () => navigate("/register");

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.background =
      "linear-gradient(120deg, #f3f2f1, #eae7e3)";
  }, []);

  return (
    <div style={containerStyle}>
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        <h1 style={headingStyle}>The Marketing Edit </h1>
        <p style={subtitleStyle}>
          Where strategy meets style — log in as a creator.
        </p>
        <div style={buttonContainerStyle}>
          <button style={buttonStyle} onClick={handleClick1}>
            Login
          </button>
          <button
            style={{ ...buttonStyle, ...outlineButtonStyle }}
            onClick={handleClick2}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

// Background — elegant neutral tones and subtle gradient
const containerStyle = {
  height: "100vh",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(120deg, #f3f2f1, #eae7e3)",
  position: "relative",
  overflow: "hidden",
  fontFamily: "'Didot', serif",
  color: "#1a1a1a",
};

// Soft transparent overlay to make text pop
const overlayStyle = {
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(circle at center, rgba(255,255,255,0.5), rgba(240,240,240,0.9))",
  zIndex: 1,
};

// Centered content with elegant layout
const contentStyle = {
  zIndex: 2,
  textAlign: "center",
  maxWidth: "600px",
  padding: "2rem",
};

// Vogue-like heading — refined and minimal
const headingStyle = {
  fontSize: "3.5rem",
  fontWeight: "500",
  letterSpacing: "1px",
  marginBottom: "1rem",
};

// Subtle, sophisticated tagline
const subtitleStyle = {
  fontSize: "1.1rem",
  fontFamily: "'Helvetica Neue', sans-serif",
  color: "#3a3a3a",
  marginBottom: "2.5rem",
  lineHeight: "1.6",
};

// Clean, minimal button layout
const buttonContainerStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "1.5rem",
};

// Button styles — one solid, one outline
const buttonStyle = {
  padding: "0.9rem 2rem",
  fontSize: "1rem",
  backgroundColor: "#1a1a1a",
  color: "#fff",
  border: "none",
  borderRadius: "30px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  fontFamily: "'Helvetica Neue', sans-serif",
  letterSpacing: "0.5px",
};

const outlineButtonStyle = {
  backgroundColor: "transparent",
  color: "#1a1a1a",
  border: "1.5px solid #1a1a1a",
};

buttonStyle[":hover"] = {
  backgroundColor: "#333",
};

// The hover states don’t apply inline, but if you move to CSS, they can easily be added.

export default App;
