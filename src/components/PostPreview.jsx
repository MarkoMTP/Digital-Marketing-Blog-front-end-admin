function PostPreview({ title, content, author, onClick }) {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{title}</h1>
      <p style={styles.content}>{content}</p>
      <p style={styles.author}>
        <span>Published by:</span>{" "}
        <span style={styles.authorName}>{author}</span>
      </p>
      <button onClick={() => onClick()} style={styles.button}>
        View Post
      </button>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
    maxWidth: "700px",
    margin: "20px auto",
    fontFamily: "'Roboto', sans-serif",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  title: {
    fontSize: "1.8em",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#2C3E50",
  },
  content: {
    fontSize: "1.1em",
    lineHeight: "1.8",
    color: "#7F8C8D",
    marginBottom: "20px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: "3", // Limit content to 3 lines
  },
  author: {
    fontSize: "1em",
    color: "#95A5A6",
    marginBottom: "20px",
  },
  authorName: {
    fontWeight: "bold",
    color: "#2980B9",
  },
  button: {
    backgroundColor: "#2980B9",
    color: "#ffffff",
    border: "none",
    padding: "12px 25px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1em",
    fontWeight: "bold",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },
  buttonHover: {
    backgroundColor: "#3498DB",
    transform: "scale(1.05)",
  },
};

// Add hover effect to button
const buttonElement = document.querySelector("button");
if (buttonElement) {
  buttonElement.addEventListener("mouseover", () => {
    buttonElement.style.backgroundColor = styles.buttonHover.backgroundColor;
    buttonElement.style.transform = styles.buttonHover.transform;
  });
  buttonElement.addEventListener("mouseout", () => {
    buttonElement.style.backgroundColor = styles.button.backgroundColor;
    buttonElement.style.transform = "none";
  });
}

export default PostPreview;
