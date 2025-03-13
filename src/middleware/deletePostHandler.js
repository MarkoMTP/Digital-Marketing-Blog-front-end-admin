import api from "../api";

const deletePostHandler = (postId, setError, setLoading, navigate) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No Token Found");
      setLoading(false);
    }

    api.delete(`/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("post deleted successfully");
    navigate("/posts");
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Something went wrong with the deletion of the post"
    );
  } finally {
    setLoading(false);
  }
};

export default deletePostHandler;
