import { render, screen } from "@testing-library/react";
import { Section } from "./Section";

test("renders a labelled section with its title and children", () => {
  render(
    <Section id="demo" title="My Title">
      <p>child content</p>
    </Section>
  );
  expect(screen.getByRole("region", { name: "My Title" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 2, name: "My Title" })).toBeInTheDocument();
  expect(screen.getByText("child content")).toBeInTheDocument();
});

test("omits the title when not provided", () => {
  const { container } = render(
    <Section id="demo">
      <span>only child</span>
    </Section>
  );
  expect(container.querySelector(".section-title")).toBeNull();
  expect(screen.getByText("only child")).toBeInTheDocument();
});
