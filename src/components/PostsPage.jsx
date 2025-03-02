import { Link } from "react-router-dom";

function PostsPage() {
  return (
    <>
      {" "}
      <h2> User Logged In</h2>
      <Link to="/">Log Out</Link>
    </>
  );
}

export default PostsPage;
