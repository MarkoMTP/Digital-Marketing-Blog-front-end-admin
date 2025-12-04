import api from "../api";

const fetchPosts = async (setPosts, setError, setLoading, userId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get(`/${userId}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setLoading(false);

    setPosts(response.data);
  } catch (err) {
    setError(err.response?.data?.message);
  } finally {
    setLoading(false);
  }
};

export default fetchPosts;
