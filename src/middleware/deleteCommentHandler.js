import api from "../api";

// Handle delete post
const handleDeleteComment = async (commentId, postId, setError, setPost) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No Token Found");
      return;
    }

    await api.delete(`/posts/${postId}/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setPost((prevPost) => ({
      ...prevPost,
      comments: prevPost.comments.filter((comment) => comment.id !== commentId),
    }));
  } catch (error) {
    console.error("Error deleting comment:", error);
    setError("An error occurred while deleting the comment.");
  }
};

export default handleDeleteComment;
