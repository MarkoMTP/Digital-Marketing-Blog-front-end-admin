import api from "../api";

// Handle delete post
const handleDeletePost = async (userId, post, setError, navigate) => {
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

export default handleDeletePost;
