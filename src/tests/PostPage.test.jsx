import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import fetchPost from "../middleware/fetchPost";
import App from "../components/App";
import LoginForm from "../components/LoginForm";
import PostsPage from "../components/Posts/PostsPage";
import ErrorPage from "../components/ErrorPage";
import PostPage from "../components/Posts/PostPage";
import userEvent from "@testing-library/user-event";
import addCommentHandler from "../middleware/addCommentHandler";
import fetchPosts from "../middleware/fetchPosts";
import api from "../api";
import handlePublishToggle from "../middleware/handlePublishToggle";
import handleDeletePost from "../middleware/deletePostHandler";
import EditPostForm from "../components/Posts/EditPostForm";
import PostProvider from "../components/PostProvider";
import handleUpdatePost from "../middleware/handleUpdatePost";
import handleDeleteComment from "../middleware/deleteCommentHandler";

vi.mock("../api");
vi.mock("../middleware/deleteCommentHandler");
vi.mock("../middleware/fetchPost");
vi.mock("../middleware/addCommentHandler");
vi.mock("../middleware/deletePostHandler");
vi.mock("../middleware/fetchPosts");
vi.mock("../middleware/handlePublishToggle");
vi.mock("../middleware/handleUpdatePost");

describe("Post Page", () => {
  beforeEach(() => {
    localStorage.setItem("token", "122434");
    vi.clearAllMocks();
  });

  describe("Post interaction and rendering", () => {
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

      await waitFor(() => {
        expect(screen.getByText(/First Post/i)).toBeInTheDocument();
      });
      expect(screen.getByText(/First comment/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Delete Post/i })
      ).toBeInTheDocument();
      expect(
        await screen.findByRole("button", { name: /Unpublish/i })
      ).toBeInTheDocument();
    });

    it("simulates deleting a post and navigates to PostsPage", async () => {
      vi.mock("jwt-decode", () => ({
        jwtDecode: () => ({ id: "123" }),
      }));

      handleDeletePost.mockImplementation(
        (userId, post, setError, navigate) => {
          navigate("/posts");
        }
      );

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
          comments: [],
        });
      });

      fetchPosts.mockImplementation((setPosts, setError, setLoading) => {
        setLoading(false);
        setPosts([
          {
            id: "2",
            title: "Second Post",
            content: "Hello I am another",
            author: "Bro",
            authorId: "123",
            createdAt: "12:30",
            isPublished: true,
            comments: [],
          },
        ]);
      });

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
          comments: [],
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

      await userEvent.click(button);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /publish/i })
        ).toBeInTheDocument();
      });
    });

    it("Doesn't show the publish/unpublish button when user is not the author", async () => {
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
          comments: [],
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
      });
    });

    it("allows a user to edit and update a post", async () => {
      vi.mock("jwt-decode", () => ({
        jwtDecode: () => ({ id: "123" }),
      }));

      let originalPost = {
        id: "1",
        title: "Original Title",
        content: "Original Content",
        author: "Author Name",
        authorId: "123",
        createdAt: "12:30",
        isPublished: true,
        comments: [],
      };

      const updatedPost = {
        id: "1",
        title: "Hey",
        content: "Hello I am new",
        author: "Author Name",
        authorId: "123",
        createdAt: "12:30",
        isPublished: true,
        comments: [],
      };

      fetchPost.mockImplementation((id, setPost, setError, setLoading) => {
        setLoading(false);
        setPost(originalPost);
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
          setPost(updatedPost);
          navigate("/posts/1");
        }
      );

      render(
        <PostProvider>
          <MemoryRouter initialEntries={["/posts/1"]}>
            <Routes>
              <Route path="/posts/:postId" element={<PostPage />} />
              <Route path="/editPostForm/:postId" element={<EditPostForm />} />
            </Routes>
          </MemoryRouter>
        </PostProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/Original Title/i)).toBeInTheDocument();
      });

      const editBtn = screen.getByRole("button", { name: /edit/i });
      await userEvent.click(editBtn);

      expect(screen.getByText(/Editing post/i)).toBeInTheDocument();

      const titleInput = screen.getByDisplayValue("Original Title");
      const contentInput = screen.getByDisplayValue("Original Content");

      await userEvent.clear(titleInput);
      await userEvent.type(titleInput, "Hey");

      await userEvent.clear(contentInput);
      await userEvent.type(contentInput, "Hello I am new");

      const submitBtn = screen.getByRole("button", { name: /save changes/i });
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText(/Hey/i)).toBeInTheDocument();
        expect(screen.getByText(/Hello I am new/i)).toBeInTheDocument();
      });
    });
  });

  describe("Post comment interactions", () => {
    it("deletes a comment successfully", async () => {
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
            },
          ],
        });
      });

      handleDeleteComment.mockImplementation(
        (commentId, postId, setError, setPost) => {
          setPost((prevPost) => ({
            ...prevPost,
            comments: [],
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

      expect(screen.getByText("First comment")).toBeInTheDocument();

      const deleteButton = screen.getByRole("button", {
        name: /delete comment/i,
      });

      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText(/No comments yet./i)).toBeInTheDocument();
      });
    });
  });
});
