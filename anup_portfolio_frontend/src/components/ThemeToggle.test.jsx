import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "./ThemeToggle";

afterEach(() => {
  document.documentElement.removeAttribute("data-theme");
  vi.restoreAllMocks();
  window.localStorage.clear();
});

test("starts from the theme theme-init.js already applied", () => {
  document.documentElement.setAttribute("data-theme", "dark");
  render(<ThemeToggle />);
  expect(screen.getByRole("button", { name: "Dark mode" })).toHaveAttribute("aria-pressed", "true");
});

test("defaults to light when nothing has been chosen", () => {
  render(<ThemeToggle />);
  expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  expect(screen.getByRole("button", { name: "Dark mode" })).toHaveAttribute("aria-pressed", "false");
});

test("toggles data-theme, persists it, and updates its pressed state", async () => {
  document.documentElement.setAttribute("data-theme", "dark");
  render(<ThemeToggle />);
  await userEvent.click(screen.getByRole("button"));
  expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  expect(window.localStorage.getItem("theme")).toBe("light");
  expect(screen.getByRole("button", { name: "Dark mode" })).toHaveAttribute("aria-pressed", "false");
});

test("still renders and toggles when storage is blocked", async () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new DOMException("blocked", "SecurityError");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new DOMException("blocked", "SecurityError");
  });
  render(<ThemeToggle />);
  const before = document.documentElement.getAttribute("data-theme");
  await userEvent.click(screen.getByRole("button"));
  expect(document.documentElement.getAttribute("data-theme")).not.toBe(before);
});
