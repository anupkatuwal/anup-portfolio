import { render, screen } from "@testing-library/react";
import { Section } from "./Section";

test("renders title, eyebrow, and children", () => {
  render(
    <Section id="demo" title="My Title" eyebrow="// note">
      <p>child content</p>
    </Section>
  );
  expect(screen.getByText("My Title")).toBeInTheDocument();
  expect(screen.getByText("// note")).toBeInTheDocument();
  expect(screen.getByText("child content")).toBeInTheDocument();
});

test("omits eyebrow and title when not provided", () => {
  const { container } = render(
    <Section id="demo">
      <span>only child</span>
    </Section>
  );
  expect(container.querySelector(".section-eyebrow")).toBeNull();
  expect(container.querySelector(".section-title")).toBeNull();
  expect(screen.getByText("only child")).toBeInTheDocument();
});
