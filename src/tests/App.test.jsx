import { describe, expect, it } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { act, render, screen } from "@testing-library/react";

import App from "../components/App";
import userEvent from "@testing-library/user-event";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";

describe("Homepage", () => {
  it("renders headline", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading").textContent).toMatch(/welcome/i);
  });
  it("Simulates user clicking on login button", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </MemoryRouter>
    );
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /login/i }));
    });
    expect(screen.getByText("Login Form")).toBeInTheDocument();
  });
  it("Simulates user clicking on register button", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </MemoryRouter>
    );

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /register/i }));
    });
    expect(screen.getByText("Register")).toBeInTheDocument();
  });
});
