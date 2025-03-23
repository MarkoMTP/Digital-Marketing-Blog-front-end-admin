import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostContext } from "../context/PostContext";
import { handleAddNewPost } from "../middleware/handleAddNewPost";

function NewPostForm({ setPosts, setError, setLoading }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2 className="heading">New Post</h2>
      <form
        data-testid="edit-post-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddNewPost(
            title,
            content,
            isPublished,
            setPosts,
            setError,
            setLoading,
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
        <input
          type="text"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="input"
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
    </div>
  );
}

export default NewPostForm;
