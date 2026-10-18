import { firstSentence, liveLinkLabel } from "./projects";

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
