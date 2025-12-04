import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logout from "../../middleware/logout";
import { PostContext } from "../../context/PostContext";
import { jwtDecode } from "jwt-decode";
import "../../styles/PostsPage.css";
import fetchDrafts from "../../middleware/fetchDrafts";

function DraftsPage() {
  const {
    posts,
    setPosts,
    error,
    setError,
    newPostCounter,
    loading,
    setLoading,
  } = useContext(PostContext);

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

  const navigate = useNavigate();

  useEffect(() => {
    fetchDrafts(setPosts, setError, setLoading, userId);
  }, [setError, setPosts, newPostCounter, setLoading, userId]);

  const handleClick = async (id) => {
    await navigate(`/posts/${id}`);
  };

  const openNewPostForm = async () => {
    navigate("/newPostForm");
  };

  if (loading && posts.length > 0)
    return <p className="loading">Loading posts...</p>;
  if (error) return <p className="error">{error}</p>;

  const openPostsPage = () => {
    navigate("/homepage");
  };
  return (
    <div className="page-container">
      <div className="sidebar">
        <h2 className="title">📢 Digital Marketing Blog</h2>
        <p className="subtitle">
          Stay ahead with the latest trends, strategies, and insights!
        </p>

        <button className="primary-button" onClick={openNewPostForm}>
          ➕ Add New Post
        </button>

        <button className="primary-button" onClick={openPostsPage}>
          📝 View Published Posts
        </button>

        <button className="logoutButton" onClick={logout}>
          🚪 Logout
        </button>
      </div>

      <div className="posts-container">
        <h1 className="heading">{posts.length ? "📰 Latest Posts" : ""}</h1>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="post-preview"
              onClick={() => handleClick(post.id)}
            >
              <h3 className="post-title">{post.title}</h3>
              <p className="post-author">
                By {post.author?.userName || "Unknown"}
              </p>

              {post.isPublished === true ? (
                <p style={{ color: "green" }}>Published</p>
              ) : (
                <p style={{ color: "red" }}>Unpublished</p>
              )}
            </div>
          ))
        ) : (
          <p className="no-posts">No posts yet.</p>
        )}
      </div>
    </div>
  );
}

export default DraftsPage;
