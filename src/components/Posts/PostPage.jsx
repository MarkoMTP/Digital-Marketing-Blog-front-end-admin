import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Comment from "../Comments/Comment";
import NewCommentForm from "../Comments/NewCommentForm";
import fetchPost from "../../middleware/fetchPost";
import { jwtDecode } from "jwt-decode";
import handlePublishToggle from "../../middleware/handlePublishToggle";
import handleDeletePost from "../../middleware/deletePostHandler";
import { PostContext } from "../../context/PostContext";
import handleDeleteComment from "../../middleware/deleteCommentHandler";
import "../../styles/PostPage.css"; // Import the new CSS

function PostPage() {
  const { post, setPost, error, setError, postUpdateCounter } =
    useContext(PostContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { postId } = useParams();
  const [commentCounter, setCommentCounter] = useState(0);

  const token = localStorage.getItem("token");
  let userId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  useEffect(() => {
    setLoading(true);
    const fetchPostData = async () => {
      if (!post || post.id !== postId) {
        await fetchPost(postId, setPost, setError, setLoading);
      } else {
        setLoading(false);
      }
    };
    fetchPostData();
  }, [postId, post, postUpdateCounter, commentCounter, setPost, setError]);

  if (loading) return <p className="loadingText">Loading post...</p>;
  if (error) return <p className="errorText">Error: {error}</p>;
  if (!post) return <p className="errorText">Post not found</p>;

  return (
    <div className="postPageContainer">
      <div className="postContentContainer">
        <h1 className="postTitle">{post.title}</h1>
        <p className="postText">{post.content}</p>
        <div className="actionButtons">
          {userId === post.authorId && (
            <>
              <button
                onClick={() =>
                  handleDeletePost(userId, post, setError, navigate)
                }
                className="actionButton deleteButton"
              >
                Delete
              </button>
              <button
                onClick={() =>
                  handlePublishToggle(post, userId, setError, setPost)
                }
                className="actionButton publishButton"
              >
                {post.isPublished ? "Unpublish" : "Publish"}
              </button>
              <button
                onClick={() => navigate(`/editPostForm/${postId}`)}
                className="actionButton editButton"
              >
                Edit
              </button>
            </>
          )}
        </div>
      </div>

      <div className="commentsContainer">
        <NewCommentForm
          id={post.id}
          setCommentCounter={setCommentCounter}
          setPost={setPost}
        />
        <h2 className="commentsTitle">Comments</h2>

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
          <p className="noCommentsText">No comments yet.</p>
        )}
      </div>

      <button onClick={() => navigate("/posts")} className="backButton">
        Go back
      </button>
    </div>
  );
}

export default PostPage;
