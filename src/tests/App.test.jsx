import { describe, expect, it } from "vitest";

import { render, screen } from "@testing-library/react";

import App from "../App";

describe("App", () => {
  it("renders headline", () => {
    render(<App />);
    expect(screen.getByRole("heading").textContent).toMatch(/our first test/i);
  });
});
