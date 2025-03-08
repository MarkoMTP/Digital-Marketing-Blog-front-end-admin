import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import LoginForm from "../components/LoginForm";
import PostsPage from "../components/PostsPage";
import ErrorPage from "../components/ErrorPage";
import App from "../components/App";
import fetchPosts from "../middleware/fetchPosts";
vi.mock("../api");
vi.mock("../middleware/fetchPosts");

describe("Posts Page", () => {
  it("Renders and displays fetched posts", async () => {
    localStorage.getItem = vi.fn().mockReturnValue("Fake-Token");

    fetchPosts.mockImplementation((setPosts, setError, setLoading) => {
      setLoading(false);
      setPosts([
        {
          id: 1,
          title: "My First Post",
          createdAt: "2024-03-05T10:00:00Z",
          author: { name: "John Doe" },
        },
        {
          id: 2,
          title: "Another Post",
          createdAt: "2024-03-04T15:30:00Z",
          author: { name: "Jane Smith" },
        },
      ]);
    });

    render(
      <MemoryRouter initialEntries={["/posts"]}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </MemoryRouter>
    );

    screen.debug();
    await waitFor(() => {
      expect(screen.getByText(/My First Post/i)).toBeInTheDocument();
      expect(screen.getByText(/Another Post/i)).toBeInTheDocument();
    });
  });
});
