import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "./ThemeToggle";

afterEach(() => {
  document.documentElement.removeAttribute("data-theme");
  vi.restoreAllMocks();
  window.localStorage.clear();
});

test("defaults to dark when nothing is saved and the system has no preference", () => {
  render(<ToggleWrapper />);
  expect(screen.getByRole("button", { name: "Switch to light theme" })).toBeInTheDocument();
});

test("toggles data-theme, persists it, and updates its label", async () => {
  render(<ToggleWrapper />);
  await userEvent.click(screen.getByRole("button"));
  expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  expect(window.localStorage.getItem("theme")).toBe("light");
  expect(screen.getByRole("button", { name: "Switch to dark theme" })).toBeInTheDocument();
});

test("still renders and toggles when storage is blocked", async () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new DOMException("blocked", "SecurityError");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new DOMException("blocked", "SecurityError");
  });
  render(<ToggleWrapper />);
  await userEvent.click(screen.getByRole("button"));
  expect(document.documentElement.getAttribute("data-theme")).toBe("light");
});

function ToggleWrapper() {
  return <ThemeToggle />;
}
