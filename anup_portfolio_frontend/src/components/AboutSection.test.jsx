import { render, screen } from "@testing-library/react";
import { AboutSection } from "./AboutSection";

test("renders the bio, the academic timeline and both downloads", () => {
  render(<AboutSection />);
  expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
  // Timeline: B.Sc. → M.Sc. → research
  const steps = screen.getByRole("list", { name: "Academic timeline" });
  expect(steps.querySelectorAll("li")).toHaveLength(3);
  expect(screen.getByRole("link", { name: "Download CV" })).toHaveAttribute("href", "/resume.pdf");
  expect(screen.getByRole("link", { name: "Download Resume" })).toHaveAttribute("href", "/resume.pdf");
});
