import api from "../api";
const handleUpdatePost = async (
  postId,
  setPost,
  setError,
  setPostUpdateCounter,
  title,
  content,
  isPublished,
  navigate
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    await api.put(
      `/posts/${postId}`,
      { title: title, content: content, isPublished: isPublished },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const response = await api.get(`/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data) {
      setPost(response.data);
      setPostUpdateCounter(
        (prevPostUpdateCounter) => prevPostUpdateCounter + 1
      );

      navigate(`/posts/${postId}`);
    } else {
      setError("Post not found");
    }
  } catch (err) {
    console.log(err);
    navigate("/error", {
      state: {
        error: err.response?.data,
      },
    });
  }
};

export default handleUpdatePost;
