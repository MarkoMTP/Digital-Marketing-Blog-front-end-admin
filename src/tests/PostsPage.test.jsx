import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import LoginForm from "../components/LoginForm";
import PostsPage from "../components/Posts/PostsPage";
import ErrorPage from "../components/ErrorPage";
import App from "../components/App";
import fetchPosts from "../middleware/fetchPosts";
import userEvent from "@testing-library/user-event";
import { act, use } from "react";
import PostProvider from "../components/PostProvider";
import PostPage from "../components/Posts/PostPage.jsx";
import { handleAddNewPost } from "../middleware/handleAddNewPost";
import NewPostForm from "../components/Posts/NewPostForm";

// Mocking fetchPosts module
vi.mock("../middleware/fetchPosts");
vi.mock("../middleware/handleAddNewPost");

describe("Posts Page", () => {
  beforeEach(() => {
    localStorage.setItem("token", "122434");
    vi.clearAllMocks(); // ✅ Reset mocks before each test
  });

  it("Renders the posts page without any posts yet", async () => {
    render(
      <MemoryRouter initialEntries={["/posts"]}>
        <PostProvider>
          <Routes>
            <Route path="/posts" element={<PostsPage />}></Route>
          </Routes>
        </PostProvider>
      </MemoryRouter>
    );

    screen.debug();
    expect(screen.getByText(/Digital Marketing Blog/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Stay ahead with the latest trends, strategies, and insights!/i
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("Renders the posts page with posts", async () => {
    fetchPosts.mockImplementation((setPosts, setError, setLoading) => {
      setLoading(false);
      setPosts([
        {
          id: "1",
          title: "First Post",
          content: "Hello",
          author: { userName: "Person 1" },
          authorId: "123",
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
            <Route path="/posts" element={<PostsPage />}></Route>
          </Routes>
        </PostProvider>
      </MemoryRouter>
    );

    screen.debug();
    expect(screen.getByText(/Digital Marketing Blog/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        "Stay ahead with the latest trends, strategies, and insights!"
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();

    expect(screen.getByText(/First Post/i)).toBeInTheDocument();
    expect(screen.getByText(/Person 1/i)).toBeInTheDocument();
  });

  it("Simulates adding a new post", async () => {
    vi.mock("jwt-decode", () => ({
      jwtDecode: () => ({ id: "123" }),
    }));

    let mockPostList = [];

    fetchPosts.mockImplementation((setPosts, setError, setLoading) => {
      setLoading(false);
      setPosts(mockPostList); // Use the updated list instead of resetting it
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
        mockPostList = [...mockPostList, newPost]; // Update the mock data
        setPosts(mockPostList);
        setNewPostCounter((prev) => prev + 1);
        navigate("/posts");
      }
    );

    render(
      <MemoryRouter initialEntries={["/posts"]}>
        <PostProvider>
          <Routes>
            <Route path="/posts" element={<PostsPage />}></Route>
            <Route path="/newPostForm" element={<NewPostForm />} />
          </Routes>
        </PostProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Digital Marketing Blog/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        "Stay ahead with the latest trends, strategies, and insights!"
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();

    const addNewPostBtn = screen.getByRole("button", { name: /Add New Post/i });

    await userEvent.click(addNewPostBtn);

    // Find form elements
    const titleInput = screen.getByPlaceholderText("Title");
    const contentInput = screen.getByPlaceholderText("Content");
    const selectPublished = screen.getByRole("combobox");

    // Type into inputs
    await userEvent.type(titleInput, "Test Title");
    await userEvent.type(contentInput, "Test Content");
    await userEvent.selectOptions(selectPublished, "true");
    // Submit the form
    fireEvent.submit(screen.getByTestId("upload-post-form"));
    await waitFor(() =>
      expect(screen.getByText(/Test Title/i)).toBeInTheDocument()
    );
  });

  it("Renders the posts page with posts", async () => {
    fetchPosts.mockImplementation((setPosts, setError, setLoading) => {
      setLoading(false);
      setPosts([]);
    });

    render(
      <MemoryRouter initialEntries={["/posts"]}>
        <PostProvider>
          <Routes>
            <Route path="/posts" element={<PostsPage />}></Route>
          </Routes>
        </PostProvider>
      </MemoryRouter>
    );

    screen.debug();
    expect(screen.getByText(/Digital Marketing Blog/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        "Stay ahead with the latest trends, strategies, and insights!"
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();

    expect(screen.getByText(/No posts yet/i)).toBeInTheDocument();
  });
});
