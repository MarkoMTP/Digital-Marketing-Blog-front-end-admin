import { useLocation } from "react-router-dom";

const ErrorPage = () => {
  const location = useLocation();

  // Extract the error from the location state
  const error = location.state?.error;

  return (
    <div>
      <h1>Error Page</h1>
      <div>
        {/* Check if error has 'errors' property and it's an array */}
        {Array.isArray(error?.errors) ? (
          error.errors.map((err, index) => (
            <div key={index}>
              <p>{err.msg || "An unknown error occurred."}</p>
            </div>
          ))
        ) : (
          // If error is not an array of errors, display the single error message
          <p>{error?.msg || error || "An unknown error occurred."}</p>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
