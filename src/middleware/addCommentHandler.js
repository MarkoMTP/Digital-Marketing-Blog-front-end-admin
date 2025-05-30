import api from "../api";

const addCommentHandler = async (
  e,
  id,
  content,
  setContent,
  setError,
  setCommentCounter,
  navigate,
  setPost
) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    await api.post(
      `/posts/${id}/comments`,
      { content }, // Request body (comment content)
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const updatedPost = api.get(`/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setPost(updatedPost.data);
    setContent(""); // Clear the input after submitting
    setError(null);
    setCommentCounter((prevCounter) => prevCounter + 1);
    navigate(`/posts/${id}`);
  } catch (err) {
    setError(err.response?.data?.message || "Failed to add comment.");
  }
};

export default addCommentHandler;
