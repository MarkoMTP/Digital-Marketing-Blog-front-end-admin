import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostContext } from "../../context/PostContext";
import handleUpdatePost from "../../middleware/handleUpdatePost";

function EditPostForm() {
  const {
    post,
    setPost,
    error,
    setError,
    postUpdateCounter,
    setPostUpdateCounter,
  } = useContext(PostContext);

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [isPublished, setIsPublished] = useState(post.isPublished);
  const navigate = useNavigate();
  const { postId } = useParams();

  return (
    <div className="container">
      <h2 className="heading">Editing Post</h2>
      <form
        data-testid="edit-post-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdatePost(
            postId,
            setPost,
            setError,
            setPostUpdateCounter,
            title,
            content,
            isPublished,
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
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditPostForm;
