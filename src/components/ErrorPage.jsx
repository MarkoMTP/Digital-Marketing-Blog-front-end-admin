import { useLocation, useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  const error = location.state?.error;

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>⚠️ Something Went Wrong</h1>
      <div style={messageContainerStyle}>
        {Array.isArray(error?.errors) ? (
          error.errors.map((err, index) => (
            <p key={index} style={messageStyle}>
              {err.msg || "An unknown error occurred."}
            </p>
          ))
        ) : (
          <p style={messageStyle}>
            {error?.msg || error || "An unknown error occurred."}
          </p>
        )}
      </div>

      <button style={buttonStyle} onClick={handleGoBack}>
        ← Back to Home
      </button>
    </div>
  );
};

const containerStyle = {
  height: "100vh",
  backgroundColor: "#001f3f", // dark blue
  color: "white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "2rem",
  textAlign: "center",
};

const headingStyle = {
  fontSize: "2.5rem",
  marginBottom: "1rem",
};

const messageContainerStyle = {
  marginBottom: "2rem",
};

const messageStyle = {
  fontSize: "1.2rem",
  margin: "0.5rem 0",
};

const buttonStyle = {
  padding: "0.75rem 1.5rem",
  backgroundColor: "#ff4136", // strong red
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "1rem",
  cursor: "pointer",
};

export default ErrorPage;
