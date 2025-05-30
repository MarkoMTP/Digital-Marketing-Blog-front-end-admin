import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { PostContext } from "../context/PostContext";
import NewPostForm from "../components/Posts/NewPostForm";

// Mock `navigate`
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock `handleAddNewPost`
vi.mock("../middleware/handleAddNewPost", () => ({
  handleAddNewPost: vi.fn(),
}));

import { handleAddNewPost } from "../middleware/handleAddNewPost";

describe("NewPostForm Component", () => {
  const mockSetPosts = vi.fn();
  const mockSetError = vi.fn();
  const mockSetLoading = vi.fn();
  const mockSetNewPostCounter = vi.fn();

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <PostContext.Provider
          value={{
            setPosts: mockSetPosts,
            setError: mockSetError,
            setLoading: mockSetLoading,
            setNewPostCounter: mockSetNewPostCounter,
          }}
        >
          <NewPostForm />
        </PostContext.Provider>
      </MemoryRouter>
    );
  };

  it("renders the form correctly", () => {
    renderComponent();
    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Content")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create new post/i })
    ).toBeInTheDocument();
  });

  it("allows typing into input fields", () => {
    renderComponent();
    const titleInput = screen.getByPlaceholderText("Title");
    const contentInput = screen.getByPlaceholderText("Content");

    fireEvent.change(titleInput, { target: { value: "Test Title" } });
    fireEvent.change(contentInput, { target: { value: "Test Content" } });

    expect(titleInput.value).toBe("Test Title");
    expect(contentInput.value).toBe("Test Content");
  });

  it("submits the form and calls handleAddNewPost", () => {
    renderComponent();
    const titleInput = screen.getByPlaceholderText("Title");
    const contentInput = screen.getByPlaceholderText("Content");
    const selectInput = screen.getByRole("combobox");
    const submitButton = screen.getByRole("button", {
      name: /create new post/i,
    });

    fireEvent.change(titleInput, { target: { value: "Test Title" } });
    fireEvent.change(contentInput, { target: { value: "Test Content" } });
    fireEvent.change(selectInput, { target: { value: "true" } });
    fireEvent.click(submitButton);

    expect(handleAddNewPost).toHaveBeenCalledWith(
      "Test Title",
      "Test Content",
      true,
      mockSetPosts,
      mockSetError,
      mockSetLoading,
      mockSetNewPostCounter,
      mockNavigate
    );
  });
});
