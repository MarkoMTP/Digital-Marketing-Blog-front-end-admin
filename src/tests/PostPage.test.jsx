import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import fetchPost from "../middleware/fetchPost";
import App from "../components/App";
import LoginForm from "../components/LoginForm";
import PostsPage from "../components/PostsPage";
import ErrorPage from "../components/ErrorPage";
import PostPage from "../components/PostPage";
import userEvent from "@testing-library/user-event";
import addCommentHandler from "../middleware/addCommentHandler";
import fetchPosts from "../middleware/fetchPosts";
import { act } from "react";
import api from "../api";
import handlePublishToggle from "../middleware/handlePublishToggle";
import handleDeletePost from "../middleware/deletePostHandler";
import handleDeleteComment from "../middleware/deleteCommentHandler";
import EditPostForm from "../components/EditPostForm";
import { PostContext } from "../context/PostContext";
import PostProvider from "../components/PostProvider";
import handleUpdatePost from "../middleware/handleUpdatePost";

vi.mock("../api");
vi.mock("../middleware/fetchPost");
vi.mock("../middleware/addCommentHandler");
vi.mock("../middleware/deletePostHandler");
vi.mock("../middleware/fetchPosts");
vi.mock("../middleware/handlePublishToggle");
vi.mock("../middleware/deleteCommentHandler");
vi.mock("../middleware/handleUpdatePost");

describe("Post Page", () => {
  beforeEach(() => {
    localStorage.setItem("token", "122434");
    vi.clearAllMocks(); // ✅ Reset mocks before each test
  });

  it("renders a published post with all its contents", async () => {
    vi.mock("jwt-decode", () => ({
      jwtDecode: () => ({ id: "123" }),
    }));

    fetchPost.mockImplementation((id, setPost, setError, setLoading) => {
      setLoading(false);
      setPost({
        id: "1",
        title: "First Post",
        content: "Hello I am a developer",
        author: "Genius",
        authorId: "123",
        createdAt: "12:30",
        isPublished: true,
        comments: [
          {
            content: "First comment",
            author: { userName: "Djuro" },
            createdAt: "12",
          },
        ],
      });
    });

    render(
      <MemoryRouter initialEntries={["/posts/1"]}>
        <PostProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/posts/:postId" element={<PostPage />} />
          </Routes>
        </PostProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/First Post/i)).toBeInTheDocument();
    expect(screen.getByText(/Genius/i)).toBeInTheDocument();
    expect(screen.getByText(/First comment/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /delete post/i })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: /Unpublish/i })
    ).toBeInTheDocument();
  });

  it("simulates deleting a post and navigates to PostsPage", async () => {
    handleDeletePost.mockImplementation(
      (postId, setError, setLoading, navigate) => {
        navigate("/posts");
      }
    );

    fetchPosts.mockImplementation((setPosts, setError, setLoading) => {
      setLoading(false);
      setPosts([
        {
          id: "2",
          title: "First Post",
          content: "Hello I am a developer",
          author: "Genius",
          authorId: "125",
          createdAt: "12:30",
          isPublished: true,
          comments: [
            {
              content: "First comment",
              author: { userName: "Djuro" },
              createdAt: "12",
            },
          ],
        },
      ]);
    });

    fetchPost.mockImplementation((id, setPost, setError, setLoading) => {
      setLoading(false);
      setPost({
        id: "1",
        title: "First Post",
        content: "Hello I am a developer",
        author: "Genius",
        authorId: "123",
        createdAt: "12:30",
        isPublished: true,
        comments: [
          {
            content: "First comment",
            author: { userName: "Djuro" },
            createdAt: "12",
          },
        ],
      });
    });

    vi.mock("jwt-decode", () => ({
      jwtDecode: () => ({ id: "123" }),
    }));

    render(
      <MemoryRouter initialEntries={["/posts/1"]}>
        <PostProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/posts/:postId" element={<PostPage />} />
          </Routes>
        </PostProvider>
      </MemoryRouter>
    );

    const deleteBtn = await screen.findByRole("button", {
      name: /delete post/i,
    });
    await userEvent.click(deleteBtn);

    await waitFor(() => {
      expect(screen.getByText(/Latest Posts/i)).toBeInTheDocument();
    });
  });

  it("Simulates the unpublish post button", async () => {
    vi.mock("jwt-decode", () => ({
      jwtDecode: () => ({ id: "123" }),
    }));

    fetchPost.mockImplementation((id, setPost, setError, setLoading) => {
      setLoading(false);
      setPost({
        id: "1",
        title: "First Post",
        content: "Hello I am a developer",
        author: "Genius",
        authorId: "123",
        createdAt: "12:30",
        isPublished: true,
        comments: [
          {
            id: "101",
            content: "First comment",
            author: { userName: "Djuro" },
            createdAt: "12",
          },
        ],
      });
    });

    handlePublishToggle.mockImplementation(
      (post, userId, setError, setPost) => {
        setPost((prevPost) => ({
          ...prevPost,
          isPublished: false,
        }));
      }
    );

    render(
      <MemoryRouter initialEntries={["/posts/1"]}>
        <PostProvider>
          <Routes>
            <Route path="/posts/:postId" element={<PostPage />} />
          </Routes>
        </PostProvider>
      </MemoryRouter>
    );

    const button = await screen.findByRole("button", { name: /unpublish/i });
    expect(button).toBeInTheDocument();

    userEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /publish/i })
      ).toBeInTheDocument();
    });
  });

  it("Doesn't show the publish/unpublish button when user is not the author", async () => {
    api.put.mockRejectedValueOnce({
      response: {
        data: { message: "You are not authorized to edit this post" },
      },
    });

    fetchPost.mockImplementation((id, setPost, setError, setLoading) => {
      setLoading(false);
      setPost({
        id: "1",
        title: "First Post",
        content: "Hello I am a developer",
        author: "Genius",
        authorId: "124",
        createdAt: "12:30",
        isPublished: true,
        comments: [
          {
            id: "101",
            content: "First comment",
            author: { userName: "Djuro" },
            createdAt: "12",
          },
        ],
      });
    });

    render(
      <MemoryRouter initialEntries={["/posts/1"]}>
        <PostProvider>
          <Routes>
            <Route path="/posts/:postId" element={<PostPage />} />
          </Routes>
        </PostProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /unpublish/i })
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole("button", { name: /delete post/i })
      ).not.toBeInTheDocument();
    });
  });

  it("simulates adding a new comment", async () => {
    fetchPost.mockImplementation((id, setPost, setError, setLoading) => {
      setLoading(false);
      setPost({
        id: "1",
        title: "First Post",
        content: "Hello I am a developer",
        author: "Genius",
        createdAt: "12:30",
        isPublished: true,
        comments: [
          {
            id: "101",
            content: "First comment",
            author: { userName: "Djuro" },
            createdAt: "12",
          },
        ],
      });
    });

    addCommentHandler.mockImplementation(
      (e, id, content, setContent, setError, setCommentCounter) => {
        e.preventDefault();
        setContent("");
        setError(null);
        setCommentCounter((prevCounter) => prevCounter + 1);
      }
    );
    fetchPost.mockImplementationOnce((id, setPost, setError, setLoading) => {
      setLoading(false);
      setPost({
        id: "1",
        title: "First Post",
        content: "Hello I am a developer",
        author: "Genius",
        createdAt: "12:30",
        isPublished: true,
        comments: [
          {
            id: "101",
            content: "First comment",
            author: { userName: "Djuro" },
            createdAt: "12",
          },
          {
            id: "102",
            content: "Second comment",
            author: { userName: "New Commenter" },
            createdAt: "12",
          },
        ],
      });
    });
    render(
      <MemoryRouter initialEntries={["/posts/1"]}>
        <PostProvider>
          <Routes>
            <Route path="/posts/:postId" element={<PostPage />} />
          </Routes>
        </PostProvider>
      </MemoryRouter>
    );

    const commentInput = screen.getByRole("textbox");
    const submitBtn = screen.getByRole("button", { name: /post comment/i });

    userEvent.type(commentInput, "Second comment");
    await userEvent.click(submitBtn);

    expect(screen.getByText("Second comment")).toBeInTheDocument();
  });
  ///////////////////////////////
  ///////////////////////////////
  ///////////////////////////////

  it("allows a user to edit and update a post ", async () => {
    vi.mock("jwt-decode", () => ({
      jwtDecode: () => ({ id: "123" }),
    }));

    // Define the original post.
    let originalPost = {
      id: "1",
      title: "Original Title",
      content: "Original Content",
      author: "Author Name",
      authorId: "123", // current user must match this for the Edit button to show
      createdAt: "12:30",
      isPublished: true,
      comments: [],
    };

    // updated post
    const updatedPost = {
      id: "1",
      title: "Hey",
      content: "Hello I am new",
      author: "Author Name",
      authorId: "123", // current user must match this for the Edit button to show
      createdAt: "12:30",
      isPublished: true,
      comments: [],
    };

    fetchPost.mockImplementation((id, setPost, setError, setLoading) => {
      setLoading(false);
      setPost(originalPost);
      // Return the current post (which gets updated)
    });

    handleUpdatePost.mockImplementation(
      (
        postId,
        setPost,
        setError,
        setPostUpdateCounter,
        title,
        content,
        isPublished,
        navigate
      ) => {
        originalPost = updatedPost; // Update the stored post
        setPost(updatedPost);
        setPostUpdateCounter((prev) => prev + 1);
        navigate("/posts/1");
      }
    );

    render(
      <PostProvider>
        <MemoryRouter initialEntries={["/posts/1"]}>
          <Routes>
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/posts/:postId" element={<PostPage />} />
            <Route path="/editPostForm/:postId" element={<EditPostForm />} />
          </Routes>
        </MemoryRouter>
      </PostProvider>
    );
    expect(screen.getByText(/Original Title/i)).toBeInTheDocument();

    //find edit btn
    const editBtn = screen.getByRole("button", { name: /edit/i });
    expect(editBtn).toBeInTheDocument();
    //click button
    await userEvent.click(editBtn);

    // check for edit form
    expect(screen.getByText(/Editing post/i)).toBeInTheDocument();

    // Grab the input fields (with initial values from the post).
    const titleInput = screen.getByDisplayValue("Original Title");
    const contentInput = screen.getByDisplayValue("Original Content");

    // Update the input values.
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "Hey");

    await userEvent.clear(contentInput);
    await userEvent.type(contentInput, "Hello I am new");

    // Verify that the Save Changes button is visible.
    const form = screen.getByTestId("edit-post-form");
    fireEvent.submit(form);
    screen.debug();

    // Check that the updated post details are rendered.
    expect(screen.getByText(/hey/i)).toBeInTheDocument();
    expect(screen.getByText(/Hello I am new/i)).toBeInTheDocument();
  });
});
