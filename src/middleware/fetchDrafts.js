import api from "../api";

const fetchDrafts = async (setPosts, setError, setLoading, userId) => {
  const token = localStorage.getItem("token");

  try {
    const response = await api.get(`/${userId}/drafts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setLoading(false);

    setPosts(response.data);
    console.log(response);
  } catch (err) {
    setError(err.response?.data?.message);
  } finally {
    setLoading(false);
  }
};

export default fetchDrafts;
