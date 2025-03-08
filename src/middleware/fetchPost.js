import api from "../api";

const fetchPost = async (id, setPost, setError, setLoading) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      setLoading(false);
    }

    const response = await api.get(`/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setPost(response.data);
  } catch (err) {
    setError(err.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

export default fetchPost;
