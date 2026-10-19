import { render, screen } from "@testing-library/react";
import { Navbar } from "./Navbar";

test("renders the name and every primary link", () => {
  render(<Navbar path="/" />);
  expect(screen.getByRole("link", { name: "Anup Katuwal" })).toBeInTheDocument();
  ["About", "Research", "Projects", "Experience", "Contact"].forEach((label) => {
    expect(screen.getAllByRole("link", { name: label }).length).toBeGreaterThan(0);
  });
});

test("the mobile menu offers the resume", () => {
  render(<Navbar path="/" />);
  expect(screen.getByRole("link", { name: "Resume (PDF)", hidden: true })).toHaveAttribute("href", "/resume.pdf");
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
