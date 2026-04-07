import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import App from "./App";

describe("App", () => {
  it("renders the template headline", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Template Project" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Automation Starter")).toBeInTheDocument();
  });
});
