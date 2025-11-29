function Comment({
  commentId,
  postId,
  content,
  author,
  createdAt,
  setError,
  setPost,
  handleDeleteComment,
  userId,
  authorId,
}) {
  return (
    <div style={styles.comment}>
      <p style={styles.content}>{content}</p>
      <div style={styles.footer}>
        <p style={styles.author}>@{author || "Unknown"}</p>
        <p style={styles.date}>{new Date(createdAt).toLocaleString()}</p>
        {userId === authorId && (
          <button
            style={styles.deleteButton}
            onMouseOver={(e) =>
              (e.target.style.background = styles.deleteButtonHover.background)
            }
            onMouseOut={(e) =>
              (e.target.style.background = styles.deleteButton.background)
            }
            onClick={() =>
              handleDeleteComment(commentId, postId, setError, setPost)
            }
          >
            Delete Comment
          </button>
        )}
      </div>
    </div>
  );
}
const styles = {
  comment: {
    background: "#f9f9f9",
    borderLeft: "4px solid #3498db",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "8px",
    boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  content: {
    fontSize: "16px",
    color: "#333",
    marginBottom: "8px",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
    color: "#777",
  },
  author: {
    fontWeight: "bold",
    color: "#3498db",
  },
  date: {
    fontStyle: "italic",
  },
  deleteButton: {
    background: "#e74c3c",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "12px",
    transition: "background 0.2s",
  },
  deleteButtonHover: {
    background: "#c0392b",
  },
};

export default Comment;
