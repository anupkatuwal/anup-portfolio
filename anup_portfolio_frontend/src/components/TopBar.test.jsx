import { render, screen } from "@testing-library/react";
import { TopBar } from "./TopBar";

test("renders the handle and every section link", () => {
  render(<TopBar path="/" />);
  expect(screen.getByText("anup.katuwal")).toBeInTheDocument();
  ["About", "Work", "Stack", "Log", "Contact"].forEach((label) => {
    expect(screen.getByRole("link", { name: label })).toHaveAttribute("href", `#${label.toLowerCase()}`);
  });
  expect(screen.getByRole("button", { name: "Open command palette" })).toBeInTheDocument();
});

test("links jump home from a sub-page", () => {
  render(<TopBar path="/research" />);
  expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("href", "/#work");
});
