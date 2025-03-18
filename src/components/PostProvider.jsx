import React, { useState } from "react";
import { PostContext } from "../context/PostContext"; // ✅ Import only the context

const PostProvider = ({ children }) => {
  const [post, setPost] = useState();
  const [error, setError] = useState();
  const [postUpdateCounter, setPostUpdateCounter] = useState(0);

  return (
    <PostContext.Provider
      value={{
        post,
        setPost,
        error,
        setError,
        postUpdateCounter,
        setPostUpdateCounter,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export default PostProvider;
