import { useState } from "react";
import addCommentHandler from "../../middleware/addCommentHandler";
import "../../styles/NewCommentForm.css"; // Use the updated CSS
import { useNavigate } from "react-router-dom";

function NewCommentForm({ id, setCommentCounter, setPost }) {
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2 className="heading">Add a Comment</h2>
      <form
        onSubmit={(e) =>
          addCommentHandler(
            e,
            id,
            content,
            setContent,
            setError,
            setCommentCounter,
            navigate,
            setPost
          )
        }
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment..."
          required
          className="textarea"
        />
        <button type="submit" className="submit-button">
          Post Comment
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default NewCommentForm;
