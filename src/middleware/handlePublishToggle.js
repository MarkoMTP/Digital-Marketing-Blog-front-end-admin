import api from "../api";

// Handle publish/unpublish post
const handlePublishToggle = async (post, userId, setError, setPost) => {
  let newPublishStatus = !post.isPublished;

  // Ensure the user is the author before allowing to publish/unpublish
  if (!userId || userId !== post.authorId) {
    setError("You are not authorized to edit this post");
    return;
  }

  try {
    // Make the API call to update the post
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No Token Found");
      return;
    }

    await api.put(
      `/posts/${post.id}`,
      {
        title: post.title,
        content: post.content,
        author: post.author,
        isPublished: newPublishStatus,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Update the post state manually
    setPost((prevPost) => ({
      ...prevPost,
      isPublished: newPublishStatus,
    }));
  } catch (error) {
    console.error("Error updating publish status:", error);
    setError("An error occurred while updating the post.");
  }
};

export default handlePublishToggle;
