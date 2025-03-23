import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import NewPostForm from "../components/NewPostForm";
import { handleAddNewPost } from "../middleware/handleAddNewPost";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PostProvider from "../components/PostProvider";
// Mock the function
vi.mock("../middleware/handleAddNewPost");

describe("NewPostForm Component", () => {
  it("renders the form and submits a new post", async () => {
    const setPosts = vi.fn();
    const setError = vi.fn();
    const setLoading = vi.fn();
    const post = {
      title: "Test Title",
      content: "Test Content",
      isPublished: true,
    };

    handleAddNewPost.mockImplementation(
      (
        title,
        content,
        isPublished,
        setPosts,
        setError,
        setLoading,
        navigate
      ) => {
        setPosts((prevPosts) => [...prevPosts, post]);
        navigate("/posts");
      }
    );

    render(
      <MemoryRouter initialEntries={["/newPostForm"]}>
        <PostProvider>
          <Routes>
            <Route
              path="/newPostForm"
              element={
                <NewPostForm
                  setPosts={setPosts}
                  setError={setError}
                  setLoading={setLoading}
                />
              }
            />
          </Routes>
        </PostProvider>
      </MemoryRouter>
    );
    // Find form elements
    const titleInput = screen.getByPlaceholderText("Title");
    const contentInput = screen.getByPlaceholderText("Content");
    const selectPublished = screen.getByRole("combobox");
    const submitButton = screen.getByRole("button", {
      name: /create new post/i,
    });

    // Type into inputs
    await userEvent.type(titleInput, "Test Title");
    await userEvent.type(contentInput, "Test Content");
    await userEvent.selectOptions(selectPublished, "true");

    // Submit the form
    await userEvent.click(submitButton);

    // Check if the function was called with the correct values
    expect(handleAddNewPost).toHaveBeenCalledWith(
      "Test Title",
      "Test Content",
      true,
      setPosts,
      setError,
      setLoading,
      expect.any(Function) // navigate function
    );
  });
});
