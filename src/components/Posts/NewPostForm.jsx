import { use, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PostContext } from "../../context/PostContext";
import { handleAddNewPost } from "../../middleware/handleAddNewPost";
function NewPostForm() {
  const { setPosts, setError, setLoading, setNewPostCounter } =
    useContext(PostContext); // use context
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/posts");
  };

  return (
    <div className="container">
      <h2 className="heading">New Post</h2>
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
        className="form"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="input"
        />
        <textarea
          type="text"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{
            maxwidth: "100%",
            width: "100%",
            boxsizing: "border-box",
            resize: "vertical",
          }}
        />
        <select
          value={isPublished}
          onChange={(e) => setIsPublished(e.target.value === "true")}
          required
          className="input"
        >
          <option value="true">Published</option>
          <option value="false">Unpublished</option>
        </select>

        <button type="submit" className="button">
          Create New Post
        </button>
      </form>

      <button
        onClick={handleGoBack}
        style={{
          marginTop: "5px",
          padding: "12px 22px",
          cursor: "pointer",
          background: "red",
          borderRadius: "10px",
          border: "0px",
        }}
      >
        Go back
      </button>
    </div>
  );
}

export default NewPostForm;
