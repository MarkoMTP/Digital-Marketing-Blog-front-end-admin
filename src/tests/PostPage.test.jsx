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
import fetchPosts from "../middleware/fetchPosts";
import { act } from "react";
import api from "../api";
import handlePublishToggle from "../middleware/handlePublishToggle";
import handleDeletePost from "../middleware/deletePostHandler";
import { jwtDecode } from "jwt-decode";
import handleDeleteComment from "../middleware/deleteCommentHandler";

vi.mock("../api");
vi.mock("../middleware/fetchPost");
vi.mock("../middleware/addCommentHandler");
vi.mock("../middleware/deletePostHandler");
vi.mock("../middleware/fetchPosts");
vi.mock("../middleware/handlePublishToggle");
vi.mock("../middleware/deleteCommentHandler");

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
  /////////////
  /////////////
  /////////////
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
      expect(screen.getByText(/Latest Posts/i)).toBeInTheDocument();
    });
  });

  //////////////////////////
  ///////////////////////////////////////
  ///////////////////////////////////////
  it("Simulates the unpublish post button", async () => {
    vi.mock("jwt-decode", () => ({
      jwtDecode: () => ({ id: "123" }),
    }));

    // ✅ Mock the fetchPost function before rendering
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

    // ✅ Mock the publish toggle function before rendering
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
        <Routes>
          <Route path="/posts/:postId" element={<PostPage />} />
        </Routes>
      </MemoryRouter>
    );

    // ✅ Ensure the "Unpublish" button is visible
    const button = await screen.findByRole("button", { name: /unpublish/i });
    expect(button).toBeInTheDocument();

    // ✅ Click the button
    userEvent.click(button);

    // ✅ Wait for the button text to change
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /publish/i })
      ).toBeInTheDocument();
    });
  });

  ///////////////////////////////////////
  ///////////////////////////////////////
  ///////////////////////////////////////
  it("Doesn't show the publish/unpublish button when user is not the author", async () => {
    // Mock API response to return a 403 error
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
          <Route path="/posts/:postId" element={<PostPage />} />
        </Routes>
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
  /////////////
  /////////////
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

    await act(async () => {
      await userEvent.click(
        screen.getByRole("button", { name: /post comment/i })
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/Hey/i)).toBeInTheDocument();
    });
  });

  it("simulates deleting the comment", async () => {
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

    handleDeleteComment.mockImplementation(
      (commentId, postId, setError, setPost) => {
        setPost((prevPost) => ({
          ...prevPost,
          comments: prevPost.comments.filter(
            (comment) => comment.id !== commentId
          ),
        }));
      }
    );

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

    await act(async () => {
      await userEvent.click(
        screen.getByRole("button", { name: /delete comment/i })
      );
    });

    expect(screen.queryByText(/First comment/i)).not.toBeInTheDocument();
  });
});
