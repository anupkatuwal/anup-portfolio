import { firstSentence, liveLinkLabel, workItems } from "./projects";

test("firstSentence keeps only the first sentence", () => {
  expect(firstSentence("One thing. Two things.")).toBe("One thing.");
  expect(firstSentence("No full stop")).toBe("No full stop");
  // A decimal point is not a sentence end.
  expect(firstSentence("Reached 84.0% accuracy. Then more.")).toBe("Reached 84.0% accuracy.");
});

test("an Upwork link is labelled as a service, anything else as live", () => {
  expect(liveLinkLabel("https://www.upwork.com/services/product/x")).toBe("Upwork service");
  expect(liveLinkLabel("https://anup-katuwal.com.np")).toBe("Live");
  expect(liveLinkLabel("not a url")).toBe("Live");
});

test("workItems orders by notes, features the first, and hides TODO copy", () => {
  const projects = [
    { id: "a", title: "A", description: "Does A. More.", metric: "1 thing", tech: ["Py"], github: "g", live: "" },
    { id: "b", title: "B", description: "Does B.", tech: [] },
    { id: "c", title: "C", description: "Does C.", tech: [] },
  ];
  const notes = [
    { id: "b", tag: "DATA", problem: "B problem", outcome: "B outcome", paper: "/research" },
    { id: "a", tag: "TODO", problem: "TODO: fill", outcome: "" },
  ];
  const items = workItems(projects, notes);
  expect(items.map((p) => p.id)).toEqual(["b", "a", "c"]);
  expect(items[0]).toMatchObject({ tag: "DATA", problem: "B problem", paper: "/research" });
  expect(items[1]).toMatchObject({ tag: "", problem: "Does A.", outcome: "1 thing", code: "g", live: "" });
});
