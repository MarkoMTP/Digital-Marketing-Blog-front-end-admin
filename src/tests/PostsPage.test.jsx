import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PostsPage from "../components/Posts/PostsPage";
import PostProvider from "../components/PostProvider";
import fetchPosts from "../middleware/fetchPosts";
import userEvent from "@testing-library/user-event";
import { handleAddNewPost } from "../middleware/handleAddNewPost";
import NewPostForm from "../components/Posts/NewPostForm";

// ✅ Mock modules
vi.mock("../middleware/fetchPosts");
vi.mock("../middleware/handleAddNewPost");

describe("Posts Page", () => {
  beforeEach(() => {
    localStorage.setItem("token", "122434");
    vi.clearAllMocks();
  });

  it("renders the posts page without any posts", async () => {
    render(
      <MemoryRouter initialEntries={["/posts"]}>
        <PostProvider>
          <Routes>
            <Route path="/posts" element={<PostsPage />} />
          </Routes>
        </PostProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Digital Marketing Blog/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Stay ahead with the latest trends/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("renders the posts page with posts", async () => {
    fetchPosts.mockImplementation((setPosts, setError, setLoading) => {
      setLoading(false);
      setPosts([
        {
          id: "1",
          title: "First Post",
          content: "Hello",
          author: { userName: "Person 1" },
          createdAt: "12:30",
          isPublished: true,
          comments: [
            {
              content: "First comment",
              author: { userName: "Person 1" },
              createdAt: "12",
            },
          ],
        },
      ]);
    });

    render(
      <MemoryRouter initialEntries={["/posts"]}>
        <PostProvider>
          <Routes>
            <Route path="/posts" element={<PostsPage />} />
          </Routes>
        </PostProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/First Post/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Person 1/i)).toBeInTheDocument();
  });

  it("simulates adding a new post", async () => {
    vi.mock("jwt-decode", () => ({
      jwtDecode: () => ({ id: "123" }),
    }));

    let mockPostList = [];

    fetchPosts.mockImplementation((setPosts, setError, setLoading) => {
      setLoading(false);
      setPosts(mockPostList);
    });

    handleAddNewPost.mockImplementation(
      (
        title,
        content,
        isPublished,
        setPosts,
        setError,
        setLoading,
        setNewPostCounter,
        navigate
      ) => {
        const newPost = {
          title,
          content,
          isPublished,
          author: { userName: "Test User" },
        };
        mockPostList = [...mockPostList, newPost];
        setPosts(mockPostList);
        setNewPostCounter((prev) => prev + 1);
        navigate("/posts");
      }
    );

    render(
      <MemoryRouter initialEntries={["/posts"]}>
        <PostProvider>
          <Routes>
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/newPostForm" element={<NewPostForm />} />
          </Routes>
        </PostProvider>
      </MemoryRouter>
    );

    const addNewPostBtn = screen.getByRole("button", { name: /Add New Post/i });
    await userEvent.click(addNewPostBtn);

    const titleInput = screen.getByPlaceholderText("Title");
    const contentInput = screen.getByPlaceholderText("Content");
    const selectPublished = screen.getByRole("combobox");

    await userEvent.type(titleInput, "Test Title");
    await userEvent.type(contentInput, "Test Content");
    await userEvent.selectOptions(selectPublished, "true");

    const form = screen.getByTestId("upload-post-form");
    await userEvent.click(form.querySelector('button[type="submit"]'));

    await waitFor(() => {
      expect(screen.getByText(/Test Title/i)).toBeInTheDocument();
    });
  });

  it("renders posts page with no posts message", async () => {
    fetchPosts.mockImplementation((setPosts, setError, setLoading) => {
      setLoading(false);
      setPosts([]);
    });

    render(
      <MemoryRouter initialEntries={["/posts"]}>
        <PostProvider>
          <Routes>
            <Route path="/posts" element={<PostsPage />} />
          </Routes>
        </PostProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No posts yet/i)).toBeInTheDocument();
    });
  });
});
