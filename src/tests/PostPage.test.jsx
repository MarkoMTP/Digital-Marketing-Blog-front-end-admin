import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import fetchPost from "../middleware/fetchPost";
import App from "../components/App";
import LoginForm from "../components/LoginForm";
import PostsPage from "../components/PostsPage";
import ErrorPage from "../components/ErrorPage";
import PostPage from "../components/PostPage";
import userEvent from "@testing-library/user-event";
import addCommentHandler from "../middleware/addCommentHandler";
import deletePostHandler from "../middleware/deletePostHandler";
import fetchPosts from "../middleware/fetchPosts";
import { act } from "react";
import api from "../api";
import { jwtDecode } from "jwt-decode";

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

vi.mock("../api");
vi.mock("../middleware/fetchPost");
vi.mock("../middleware/addCommentHandler");
vi.mock("../middleware/deletePostHandler");
vi.mock("../middleware/fetchPosts");

describe("Post Page", () => {
  beforeEach(() => {
    localStorage.setItem("token", "122434");
  });

  it("renders a published post with all its contents", async () => {
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
            content: "First comment",
            author: { userName: "Djuro" },
            createdAt: "12",
          },
        ],
      });
    });

    render(
      <MemoryRouter initialEntries={["/posts/1"]}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/posts/:postId" element={<PostPage />} />
        </Routes>
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
    deletePostHandler.mockImplementation(
      (postId, setError, setLoading, navigate) => {
        navigate("/posts");
      }
    );

    fetchPosts.mockImplementation((setPosts, setError, setLoading) => {
      setLoading(false);
      setPosts([
        {
          id: "2",
          title: "General Post",
          content: "Hello 2",
          author: "Genius 2",
          createdAt: "12:30",
          isPublished: true,
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

    localStorage.setItem("token", "mocked_token");

    render(
      <MemoryRouter initialEntries={["/posts/1"]}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/posts/:postId" element={<PostPage />} />
        </Routes>
      </MemoryRouter>
    );

    const deleteBtn = await screen.findByRole("button", {
      name: /delete post/i,
    });
    await userEvent.click(deleteBtn);

    await waitFor(() => {
      expect(screen.getByText(/General post/i)).toBeInTheDocument();
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

    render(
      <MemoryRouter initialEntries={["/posts/1"]}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/posts/:postId" element={<PostPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/First comment/i)).toBeInTheDocument();

    await userEvent.type(
      screen.getByPlaceholderText(/Write your comment.../i),
      "Hey"
    );

    addCommentHandler.mockImplementation(
      (e, id, content, setContent, setError, setCommentCounter) => {
        e.preventDefault();
        setContent("");
        setError(null);
        setCommentCounter((prevCounter) => prevCounter + 1);

        fetchPost.mockImplementationOnce(
          (id, setPost, setError, setLoading) => {
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
                  content: "Hey",
                  author: { userName: "TestUser" },
                  createdAt: "13",
                },
              ],
            });
          }
        );
      }
    );

    await act(async () => {
      await userEvent.click(
        screen.getByRole("button", { name: /post comment/i })
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/Hey/i)).toBeInTheDocument();
    });
  });

  it("Simulates the unpublish post button", async () => {
    // ✅ Correct mock usage for jwtDecode
    jwtDecode.mockReturnValueOnce({ id: "123" });

    // ✅ Mock the post-fetch function
    fetchPost.mockImplementation((id, setPost, setError, setLoading) => {
      setLoading(false);
      setPost({
        id: "1",
        title: "First Post",
        content: "Hello I am a developer",
        author: "Genius",
        authorId: "123",
        createdAt: "12:30",
        isPublished: true, // Initially published
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
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/posts/:postId" element={<PostPage />} />
        </Routes>
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: /unpublish/i });
    userEvent.click(button);

    // ✅ Mock the API call to `api.put`
    api.put.mockResolvedValueOnce({
      data: { id: "1", isPublished: false }, // Simulate the API response
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Publish" })
      ).toBeInTheDocument(); // Ensure button updates to "Publish"
    });

    screen.debug(); // Check the rendered output if necessary
  });
});
it("Shows an error when an unauthorized user tries to unpublish a post", async () => {
  // Mock API response to return a 403 error
  api.put.mockRejectedValueOnce({
    response: {
      status: 401,
      data: { message: "You are not authorized to edit this post" },
    },
  });

  render(
    <MemoryRouter initialEntries={["/posts/1"]}>
      <Routes>
        <Route path="/posts/:postId" element={<PostPage />} />
      </Routes>
    </MemoryRouter>
  );

  const button = screen.getByRole("button", { name: /unpublish/i });

  userEvent.click(button);

  await waitFor(() => {
    expect(screen.getByText(/you are not authorized/i)).toBeInTheDocument();
  });
});
