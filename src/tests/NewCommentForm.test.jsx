import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NewCommentForm from "../components/Comments/NewCommentForm";
import App from "../components/App";
import PostsPage from "../components/Posts/PostsPage";
import ErrorPage from "../components/ErrorPage";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("New comment form", () => {
  beforeEach(() => {
    // Mock localStorage.getItem to return a valid token
    localStorage.getItem = vi.fn().mockReturnValue("12345678");
  });
  it("Renders all", () => {
    render(
      <MemoryRouter initialEntries={["/posts/:postId/comments"]}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/posts/:postId/comments" element={<NewCommentForm />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/add a comment/i)).toBeInTheDocument();
    screen.getByPlaceholderText(/write your comment/i);
  });

  it("Simulates typing a new comment", async () => {
    render(
      <MemoryRouter initialEntries={["/posts/:postId/newCommentForm"]}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route
            path="/posts/:postId/newCommentForm"
            element={<NewCommentForm />}
          />
        </Routes>
      </MemoryRouter>
    );

    await userEvent.type(
      screen.getByPlaceholderText(/Write your comment.../i),
      "Hey bitch"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /post comment/i })
    );
    await waitFor(() => {
      expect(screen.getByText(/Hey Bitch/i)).toBeInTheDocument();
    });
  });
});
