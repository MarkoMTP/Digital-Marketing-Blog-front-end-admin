import api from "../api";

const fetchPosts = async (setPosts, setError, setLoading) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    const response = await api.get("/posts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setLoading(false);

    setPosts(response.data);
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Something went wrong with fetching of posts"
    );
  } finally {
    setLoading(false);
  }
};

export default fetchPosts;
