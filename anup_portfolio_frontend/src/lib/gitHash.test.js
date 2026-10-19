import { shortHash } from "./gitHash";

test("is seven hex characters and stable for the same input", () => {
  const h = shortHash("Teaching Assistant College of Applied Business");
  expect(h).toMatch(/^[0-9a-f]{7}$/);
  expect(shortHash("Teaching Assistant College of Applied Business")).toBe(h);
  expect(shortHash("Consultant Supervisor")).not.toBe(h);
});
