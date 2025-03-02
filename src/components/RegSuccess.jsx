import { Link } from "react-router-dom";

function RegisterSuccess() {
  return (
    <>
      {" "}
      <h2> User Registered</h2>
      <Link to="/login">Go back</Link>
    </>
  );
}

export default RegisterSuccess;
