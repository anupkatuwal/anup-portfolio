import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactSection } from "./ContactSection";

test("renders labelled fields and the send button", () => {
  render(<ContactSection />);
  ["name", "email", "subject", "message"].forEach((label) => {
    expect(screen.getByLabelText(label)).toBeInTheDocument();
  });
  expect(screen.getByRole("button", { name: "Send request" })).toBeInTheDocument();
});

test("an empty submit shows field errors linked by aria-describedby", async () => {
  const fetchSpy = vi.spyOn(globalThis, "fetch");
  render(<ContactSection />);
  await userEvent.click(screen.getByRole("button", { name: "Send request" }));
  const email = screen.getByLabelText("email");
  expect(email).toHaveAttribute("aria-invalid", "true");
  expect(email).toHaveAccessibleDescription("That email address doesn't look right.");
  expect(fetchSpy).not.toHaveBeenCalled();
  fetchSpy.mockRestore();
});

test("includes a honeypot field that is hidden from humans", () => {
  const { container } = render(<ContactSection />);
  const honeypot = container.querySelector('input[name="company"]');
  expect(honeypot).not.toBeNull();
  // Must be untabbable and inside an aria-hidden, display:none wrapper.
  expect(honeypot.getAttribute("tabindex")).toBe("-1");
  const wrapper = honeypot.closest('[aria-hidden="true"]');
  expect(wrapper).not.toBeNull();
  expect(wrapper.style.display).toBe("none");
});
