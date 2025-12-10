import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RegisterForm from "../components/RegisterForm";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import App from "../components/App";
import api from "../api";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import RegisterSuccess from "../components/RegSuccess";
import ErrorPage from "../components/ErrorPage";

vi.mock("../api");

describe("Register Form", () => {
  it("Renders the Register Form", async () => {
    render(
      <MemoryRouter initialEntries={["/register"]}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  it("Simulates a user inserting data,submiting it and geting success from server", async () => {
    render(
      <MemoryRouter initialEntries={["/register"]}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/registrationSuccess" element={<RegisterSuccess />} />
        </Routes>
      </MemoryRouter>
    );

    await userEvent.type(screen.getByPlaceholderText(/username/i), "testuser");
    await userEvent.type(
      screen.getByPlaceholderText(/email/i),
      "test@example.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText("Password"),
      "mypassword123"
    );
    await userEvent.type(
      screen.getByPlaceholderText("Confirm Password"),
      "mypassword123"
    );
    userEvent.click(screen.getByRole("button", { name: /register/i }));

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /register/i }));
    });
    expect(screen.getByText(/User Registered/i)).toBeInTheDocument();
  });
  it("Simulates a user inserting invalid password and getting error", async () => {
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
      <MemoryRouter initialEntries={["/register"]}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </MemoryRouter>
    );

    await userEvent.type(screen.getByPlaceholderText(/username/i), "testuser");
    await userEvent.type(
      screen.getByPlaceholderText(/email/i),
      "test@example.com"
    );
    await userEvent.type(screen.getByPlaceholderText("Password"), "mypassw");
    await userEvent.type(
      screen.getByPlaceholderText("Confirm Password"),
      "mypassw"
    );

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /register/i }));
    });

    expect(
      screen.getByText(/password must be at least 8 characters long./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/password must contain at least one number./i)
    ).toBeInTheDocument();
  });
});
