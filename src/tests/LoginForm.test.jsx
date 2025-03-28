import { describe, expect, it, vi } from "vitest";
import App from "../components/App";
import LoginForm from "../components/LoginForm";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import api from "../api";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import PostsPage from "../components/PostsPage";
import ErrorPage from "../components/ErrorPage";
import PostProvider from "../components/PostProvider";
vi.mock("../api");

describe("Login Form", () => {
  it("Renders All", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/login form/i)).toBeInTheDocument();
  });

  it("Simulates user inserting data and having a successful login", async () => {
    api.post.mockResolvedValueOnce({
      data: { token: "12345567" },
    });

    api.get.mockResolvedValueOnce({
      data: [
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
      ],
    });
    render(
      <PostProvider>
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/posts" element={<PostsPage />} />
          </Routes>
        </MemoryRouter>
      </PostProvider>
    );

    await userEvent.type(
      screen.getByPlaceholderText(/email/i),
      "djuro@gmail.com"
    );

    await userEvent.type(screen.getByPlaceholderText(/password/i), "12345678");

    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Latest Post/i)).toBeInTheDocument();
    });
  });

  it("Simulates user inserting data and having no token received error", async () => {
    // Use mockRejectedValueOnce to simulate an error scenario
    api.post.mockResolvedValueOnce({
      data: {}, // Mock response without the token field to trigger the error path
    });

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </MemoryRouter>
    );

    await userEvent.type(
      screen.getByPlaceholderText(/email/i),
      "djuro@gmail.com"
    );

    await userEvent.type(screen.getByPlaceholderText(/password/i), "12345678");

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /login/i }));
    });

    await waitFor(() => {
      // Expect error message
      expect(screen.getByText(/No token received/i)).toBeInTheDocument();
    });
  });

  it("Simulates user inserting invalid password and getting error", async () => {
    // Mock the API call to return an error
    api.post.mockRejectedValueOnce({
      response: {
        data: {
          errors: [
            { msg: "Password must be at least 8 characters long." },
            { msg: "Password must contain at least one number." },
          ],
        },
      },
    });

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Simulate typing in the form
    await userEvent.type(
      screen.getByPlaceholderText(/email/i),
      "test@example.com"
    );
    await userEvent.type(screen.getByPlaceholderText(/password/i), "mypassw");

    // Click the login button
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /login/i }));
    });

    // Assert that the error messages appear on the screen
    expect(
      screen.getByText(/Password must be at least 8 characters long./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Password must contain at least one number./i)
    ).toBeInTheDocument();
  });
});
