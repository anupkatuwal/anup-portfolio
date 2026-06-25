import { render, screen } from "@testing-library/react";
import { ContactSection } from "./ContactSection";

test("renders the visible contact fields", () => {
  render(<ContactSection />);
  expect(screen.getByLabelText("Name")).toBeInTheDocument();
  expect(screen.getByLabelText("Email")).toBeInTheDocument();
  expect(screen.getByLabelText("Subject")).toBeInTheDocument();
  expect(screen.getByLabelText("Message")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
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
