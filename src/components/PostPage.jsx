import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Comment from "./Comment";
import NewCommentForm from "./NewCommentForm";
import fetchPost from "../middleware/fetchPost";
import "../styles/PostPage.css"; // Import the CSS file
import { jwtDecode } from "jwt-decode";
import handlePublishToggle from "../middleware/handlePublishToggle";
import handleDeletePost from "../middleware/deletePostHandler";
import { PostContext } from "../context/PostContext";
import handleDeleteComment from "../middleware/deleteCommentHandler";

function PostPage() {
  const {
    post,
    setPost,
    error,
    setError,
    postUpdateCounter,
    setPostUpdateCounter,
  } = useContext(PostContext);
  const [loading, setLoading] = useState(true);
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

  // Fetch the post when the page loads, but only if it's not already in context
  useEffect(() => {
    // Only fetch the new post if the current post is not the one being requested
    setLoading(true);
    const fetchPostData = async () => {
      if (!post || post.id !== postId) {
        // Fetch the post if it's not already in context or the post doesn't match the current postId
        await fetchPost(postId, setPost, setError, setLoading);
      } else {
        setLoading(false); // Otherwise, just set loading to false if the post is already in context
      }
    };

    fetchPostData();
  }, [postId, post, postUpdateCounter, commentCounter, setPost, setError]);

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
          className="goBackButton"
        >
          {post.isPublished ? "Unpublish" : "Publish"}
        </button>
      )}
      {userId === post.authorId && (
        <button
          onClick={() => navigate(`/editPostForm/${postId}`)}
          className="goBackButton"
        >
          Edit
        </button>
      )}
      {/* Display any errors */}
      {error && <p className="errorMessage">{error}</p>}

      <NewCommentForm
        id={post.id}
        setCommentCounter={setCommentCounter}
        setPost={setPost}
      />

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
            handleDeleteComment={handleDeleteComment}
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
