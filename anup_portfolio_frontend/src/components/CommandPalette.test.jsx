import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommandPalette } from "./CommandPalette";

afterEach(() => {
  document.documentElement.removeAttribute("data-theme");
  window.localStorage.clear();
});

test("Ctrl+K opens it with focus in the search box; Escape closes it", async () => {
  render(<CommandPalette />);
  expect(screen.queryByRole("dialog")).toBeNull();
  await userEvent.keyboard("{Control>}k{/Control}");
  expect(screen.getByRole("dialog", { name: "Command palette" })).toBeInTheDocument();
  expect(screen.getByRole("combobox")).toHaveFocus();
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).toBeNull();
});

test("typing filters the list and Enter runs the active command", async () => {
  render(<CommandPalette />);
  await userEvent.keyboard("/");
  await userEvent.type(screen.getByRole("combobox"), "theme");
  const options = screen.getAllByRole("option");
  expect(options).toHaveLength(1);
  expect(options[0]).toHaveAttribute("aria-selected", "true");
  await userEvent.keyboard("{Enter}");
  expect(document.documentElement.getAttribute("data-theme")).toBe("light");
});

test("arrow keys move the active option", async () => {
  render(<CommandPalette />);
  await userEvent.keyboard("/");
  const input = screen.getByRole("combobox");
  await userEvent.keyboard("{ArrowDown}");
  const active = screen.getAllByRole("option").find((o) => o.getAttribute("aria-selected") === "true");
  expect(input).toHaveAttribute("aria-activedescendant", active.id);
  expect(active).toHaveTextContent("Go to Work");
});
