import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Comment from "./Comment";
import NewCommentForm from "./NewCommentForm";
import fetchPost from "../middleware/fetchPost";
import "../styles/PostPage.css"; // Import the CSS file
import { jwtDecode } from "jwt-decode";
import handlePublishToggle from "../middleware/handlePublishToggle";
import handleDeletePost from "../middleware/deletePostHandler";

function PostPage() {
  const [post, setPost] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { postId } = useParams();
  const [commentCounter, setCommentCounter] = useState(0);

  const token = localStorage.getItem("token"); // Retrieve token from localStorage
  let userId = null;

  // Decode the token only once
  if (token) {
    try {
      const decoded = jwtDecode(token); // Decode the JWT
      userId = decoded.id; // Extract user ID (or whatever key represents the user)
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  // Fetch the post when the page loads
  useEffect(() => {
    fetchPost(postId, setPost, setError, setLoading);
  }, [postId, commentCounter]);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div className="container">
      <h1 className="title">{post.title}</h1>
      <p className="content">{post.content}</p>
      <p className="content">{post.author}</p>

      {/* Only show the Delete button if the user is the author */}
      {userId === post.authorId && (
        <button
          onClick={() => handleDeletePost(userId, post, setError, navigate)}
          className="goBackButton"
        >
          Delete Post
        </button>
      )}

      {/* Only show the Publish/Unpublish button if the user is the author */}
      {userId === post.authorId && (
        <button
          onClick={() => handlePublishToggle(post, userId, setError, setPost)}
          className="publishBtn"
        >
          {post.isPublished ? "Unpublish" : "Publish"}
        </button>
      )}

      {/* Display any errors */}
      {error && <p className="errorMessage">{error}</p>}

      <NewCommentForm id={post.id} setCommentCounter={setCommentCounter} />

      <h2 className="commentsTitle">Comments:</h2>
      {post.comments && post.comments.length > 0 ? (
        post.comments.map((comment) => (
          <Comment
            key={comment.id}
            commentId={comment.id}
            postId={post.id}
            content={comment.content}
            author={comment.author.userName}
            createdAt={comment.createdAt}
            setError={setError}
            setPost={setPost}
          />
        ))
      ) : (
        <p className="noComments">No comments yet.</p>
      )}

      <button onClick={() => navigate("/posts")} className="goBackButton">
        Go back
      </button>
    </div>
  );
}

export default PostPage;
