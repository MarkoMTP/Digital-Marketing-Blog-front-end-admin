import api from "../api";

export const handleAddNewPost = async (
  title,
  content,
  isPublished,
  setPosts,
  setError,
  setLoading,
  navigate
) => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    const response = await api.post(
      "/posts",
      { title, content, isPublished },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response?.data) {
      setPosts((prevPosts) => [...prevPosts, response.data]);
      navigate("/posts");
    } else {
      console.error("Error while creating post");
      setError("Error while creating post");
    }
  } catch (err) {
    console.error(err);
    setError(err.message || "An unexpected error occurred");
  } finally {
    setLoading(false);
  }
};
