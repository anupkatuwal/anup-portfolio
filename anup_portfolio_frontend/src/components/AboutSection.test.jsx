import { render, screen } from "@testing-library/react";
import { AboutSection } from "./AboutSection";
import { ABOUT } from "../data/content";

test("renders the bio and no duplicate resume downloads", () => {
  render(<AboutSection />);
  expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
  expect(screen.getByText(ABOUT.lead)).toBeInTheDocument();
  // The hero's Resume button is the single resume link on the page.
  expect(screen.queryByRole("link")).toBeNull();
});
