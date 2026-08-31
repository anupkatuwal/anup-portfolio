import { render, screen } from "@testing-library/react";
import { Navbar } from "./Navbar";

test("renders the AK monogram and every primary link", () => {
  render(<Navbar path="/" />);
  expect(screen.getByText("AK")).toBeInTheDocument();
  ["Home", "Research", "Projects", "Experience", "Blog", "Contact"].forEach((label) => {
    expect(screen.getAllByRole("link", { name: label }).length).toBeGreaterThan(0);
  });
});

test("hash links stay in-page on the homepage", () => {
  render(<Navbar path="/" />);
  const [projects] = screen.getAllByRole("link", { name: "Projects" });
  expect(projects).toHaveAttribute("href", "#projects");
});

test("hash links jump home from a sub-page, and the current page is marked", () => {
  render(<Navbar path="/research" />);
  const [projects] = screen.getAllByRole("link", { name: "Projects" });
  expect(projects).toHaveAttribute("href", "/#projects");
  const [research] = screen.getAllByRole("link", { name: "Research" });
  expect(research).toHaveAttribute("aria-current", "page");
});
