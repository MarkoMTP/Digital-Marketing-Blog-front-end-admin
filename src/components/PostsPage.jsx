import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import fetchPosts from "../middleware/fetchPosts";
import logout from "../middleware/logout";
import PostPreview from "./PostPreview";

function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleClick = async (id) => {
    await navigate(`/posts/${id}`);
  };

  useEffect(() => {
    fetchPosts(setPosts, setError, setLoading);
  }, []);

  if (loading) return <p className="loading">Loading posts...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="page-container">
      <div className="sidebar">
        <h2 className="title">🚀 Digital Marketing Blog</h2>
        <p className="subtitle">
          Stay ahead with the latest trends, strategies, and tips!
        </p>
        <button onClick={logout} className="logoutButton">
          Logout
        </button>{" "}
        {/* Logout Button */}
      </div>

      <div className="posts-container">
        <h1 className="heading">Latest Posts</h1>
        {posts.map((post) => (
          <PostPreview
            key={post.id}
            title={post.title}
            author={post.author.userName}
            onClick={() => handleClick(post.id)}
            className="post-preview"
          />
        ))}
      </div>
    </div>
  );
}

export default PostsPage;
