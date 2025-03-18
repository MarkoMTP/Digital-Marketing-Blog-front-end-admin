import api from "../api";

const fetchPost = async (id, setPost, setError, setLoading) => {
  setLoading(true); // Set loading to true when starting to fetch
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    const response = await api.get(`/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data) {
      setPost(response.data);
    } else {
      setError("Post not found");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false); // Set loading to false once fetching is complete
  }
};

export default fetchPost;
