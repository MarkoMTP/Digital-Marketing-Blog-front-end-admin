import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import fetchPosts from "../middleware/fetchPosts";
import logout from "../middleware/logout";
import PostPreview from "./PostPreview";
import { PostContext } from "../context/PostContext";

function PostsPage() {
  const {
    posts,
    setPosts,
    error,
    setError,
    newPostCounter,
    loading,
    setLoading,
  } = useContext(PostContext);

  const navigate = useNavigate();

  const handleClick = async (id) => {
    await navigate(`/posts/${id}`);
  };

  useEffect(() => {
    fetchPosts(setPosts, setError, setLoading);
  }, [setError, setPosts, newPostCounter, setLoading]);

  const openNewPostForm = async () => {
    navigate("/newPostForm");
  };

  if (loading && posts.length > 0)
    return <p className="loading">Loading posts...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="page-container">
      <div className="sidebar">
        <h2 className="title">Digital Marketing Blog</h2>
        <p className="subtitle">
          Stay ahead with the latest trends, strategies, and tips!
        </p>
        <button onClick={openNewPostForm}>Add New Post</button>
        <button onClick={logout} className="logoutButton">
          Logout
        </button>{" "}
        {/* Logout Button */}
      </div>

      <div className="posts-container">
        <h1 className="heading">{posts.length ? "Latest Posts" : ""}</h1>
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostPreview
              key={post.id}
              title={post.title}
              author={post.author?.userName || "Unknown Author"}
              onClick={() => handleClick(post.id)}
              className="post-preview"
            />
          ))
        ) : (
          <p>No posts yet</p> // 👈 This will be displayed if there are no posts
        )}
      </div>
    </div>
  );
}

export default PostsPage;
