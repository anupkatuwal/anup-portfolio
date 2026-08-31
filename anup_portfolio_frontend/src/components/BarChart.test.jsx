import { render, screen } from "@testing-library/react";
import { BarChart } from "./BarChart";

const simple = {
  id: "perf",
  title: "Performance",
  unit: "score",
  max: 1,
  bars: [{ label: "Accuracy", value: 0.84 }, { label: "Macro-F1", value: 0.688 }],
};

const grouped = {
  id: "fair",
  title: "Parity",
  unit: "DPD",
  max: 0.35,
  grouped: true,
  bars: [{ label: "Dialect", before: 0.327, after: 0.066 }],
};

test("direct-labels every bar with its value", () => {
  const { container } = render(<BarChart chart={simple} />);
  expect(screen.getByText("0.84")).toBeInTheDocument();
  expect(screen.getByText("0.688")).toBeInTheDocument();
  expect(container.querySelectorAll("rect.chart-bar")).toHaveLength(2);
});

test("a grouped chart draws two bars per row and carries a legend", () => {
  const { container } = render(<BarChart chart={grouped} />);
  expect(container.querySelectorAll("rect.chart-bar")).toHaveLength(2);
  expect(screen.getByText("Before debiasing")).toBeInTheDocument();
  expect(screen.getByText("After debiasing")).toBeInTheDocument();
});

test("bar width is proportional to the value and never exceeds the plot", () => {
  const { container } = render(<BarChart chart={grouped} />);
  const [before, after] = container.querySelectorAll("rect.chart-bar");
  expect(Number(before.getAttribute("width"))).toBeGreaterThan(
    Number(after.getAttribute("width"))
  );
  expect(Number(before.getAttribute("width"))).toBeLessThanOrEqual(1000 - 116 - 92);
});
