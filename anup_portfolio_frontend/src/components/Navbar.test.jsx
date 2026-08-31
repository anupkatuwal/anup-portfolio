import { render, screen } from "@testing-library/react";
import { Navbar } from "./Navbar";

test("renders the AK monogram and every primary link", () => {
  render(<Navbar path="/" />);
  expect(screen.getByText("AK")).toBeInTheDocument();
  ["Home", "Research", "Projects", "Experience", "Blog", "Contact"].forEach((label) => {
    expect(screen.getAllByRole("link", { name: label }).length).toBeGreaterThan(0);
  });
});

test("the mobile drawer offers both the resume and the Upwork profile", () => {
  render(<Navbar path="/" />);
  expect(screen.getByRole("link", { name: /Resume \(PDF\)/ })).toHaveAttribute("href", "/resume.pdf");
  const upwork = screen.getByRole("link", { name: /Upwork/ });
  expect(upwork).toHaveAttribute("href", "https://www.upwork.com/freelancers/~01fe60c948627059d5");
  expect(upwork).toHaveAttribute("rel", "noopener noreferrer");
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
