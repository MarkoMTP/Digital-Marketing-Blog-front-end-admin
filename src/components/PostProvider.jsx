import React, { useState } from "react";
import { PostContext } from "../context/PostContext"; // ✅ Import only the context

const PostProvider = ({ children }) => {
  const [post, setPost] = useState();
  const [error, setError] = useState();
  const [postUpdateCounter, setPostUpdateCounter] = useState(0);
  const [newPostCounter, setNewPostCounter] = useState(0);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <PostContext.Provider
      value={{
        post,
        setPost,
        error,
        setError,
        postUpdateCounter,
        setPostUpdateCounter,
        newPostCounter,
        setNewPostCounter,
        posts,
        setPosts,
        loading,
        setLoading,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export default PostProvider;
