import { Link } from "react-router-dom";

function RegisterSuccess() {
  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>🎉 User Registered Successfully!</h2>
      <Link to="/login" style={linkStyle}>
        ← Go to Login
      </Link>
    </div>
  );
}

const containerStyle = {
  height: "100vh",
  backgroundColor: "#001f3f", // dark blue
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "#ffffff",
  textAlign: "center",
  padding: "2rem",
};

const headingStyle = {
  fontSize: "2rem",
  marginBottom: "1.5rem",
};

const linkStyle = {
  fontSize: "1.1rem",
  color: "#00bfff", // lighter blue for contrast
  textDecoration: "none",
  padding: "0.5rem 1rem",
  border: "1px solid #00bfff",
  borderRadius: "8px",
  transition: "background 0.3s",
};

export default RegisterSuccess;
