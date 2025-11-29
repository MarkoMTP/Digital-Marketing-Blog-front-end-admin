import { use, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PostContext } from "../../context/PostContext";
import { handleAddNewPost } from "../../middleware/handleAddNewPost";
import "../../styles/NewPostForm.css";
function NewPostForm() {
  const { setPosts, setError, setLoading, setNewPostCounter } =
    useContext(PostContext); // use context
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/homepage");
  };

  return (
    <div className="new-post-container">
      <h2 className="new-post-heading">Create a New Post</h2>
      <form
        data-testid="upload-post-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddNewPost(
            title,
            content,
            isPublished,
            setPosts,
            setError,
            setLoading,
            setNewPostCounter,
            navigate
          );
        }}
        className="new-post-form"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="new-post-input"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="new-post-textarea"
        />
        <select
          value={isPublished}
          onChange={(e) => setIsPublished(e.target.value === "true")}
          required
          className="new-post-select"
        >
          <option value="true">Published</option>
          <option value="false">Unpublished</option>
        </select>

        <button type="submit" className="new-post-submit">
          Create Post
        </button>
      </form>

      <button onClick={handleGoBack} className="new-post-back-button">
        Go Back
      </button>
    </div>
  );
}

export default NewPostForm;
