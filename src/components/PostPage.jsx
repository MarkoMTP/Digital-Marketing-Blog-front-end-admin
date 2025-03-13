import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Comment from "./Comment";
import NewCommentForm from "./NewCommentForm";
import fetchPost from "../middleware/fetchPost";
import "../styles/PostPage.css"; // Import the CSS file
import deletePostHandler from "../middleware/deletePostHandler";
import api from "../api";
import { jwtDecode } from "jwt-decode";

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

  // If the post is still loading, show loading message
  if (loading) return <p>Loading posts...</p>;
  // If there is an error, show error message
  if (error) return <p>Error: {error}</p>;
  // If the post is not found, show post not found message
  if (!post) return <p>Post not found</p>;

  // Handle publish/unpublish post
  const handlePublishToggle = async () => {
    let newPublishStatus = !post.isPublished;

    // Ensure the user is the author before allowing to publish/unpublish
    if (!userId || userId !== post.authorId) {
      setError("You are not authorized to edit this post");
      return;
    }

    try {
      // Make the API call to update the post
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No Token Found");
        return;
      }

      await api.put(
        `/posts/${post.id}`,
        {
          title: post.title,
          content: post.content,
          author: post.author,
          isPublished: newPublishStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the post state manually
      setPost((prevPost) => ({
        ...prevPost,
        isPublished: newPublishStatus,
      }));
    } catch (error) {
      console.error("Error updating publish status:", error);
      setError("An error occurred while updating the post.");
    }
  };

  // Handle delete post
  const handleDeletePost = async () => {
    // Ensure the user is the author before allowing to delete
    if (!userId || userId !== post.authorId) {
      setError("You are not authorized to delete this post");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No Token Found");
        return;
      }

      await api.delete(`/posts/${post.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Navigate to the posts page after successful deletion
      navigate("/posts");
    } catch (error) {
      console.error("Error deleting post:", error);
      setError("An error occurred while deleting the post.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">{post.title}</h1>
      <p className="content">{post.content}</p>
      <p className="content">{post.author}</p>

      {/* Only show the Delete button if the user is the author */}
      {userId === post.authorId && (
        <button onClick={handleDeletePost} className="goBackButton">
          Delete Post
        </button>
      )}

      {/* Only show the Publish/Unpublish button if the user is the author */}
      {userId === post.authorId && (
        <button onClick={handlePublishToggle} className="publishBtn">
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
            content={comment.content}
            author={comment.author.userName}
            createdAt={comment.createdAt}
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
