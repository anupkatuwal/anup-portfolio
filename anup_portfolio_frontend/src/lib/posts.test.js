import { formatDate, byNewest } from "./posts";

test("formats an ISO date without drifting across time zones", () => {
  expect(formatDate("2026-07-18")).toBe("18 July 2026");
});

test("sorts posts newest first", () => {
  const posts = [{ date: "2026-04-21" }, { date: "2026-07-18" }, { date: "2026-06-02" }];
  expect([...posts].sort(byNewest).map((p) => p.date)).toEqual([
    "2026-07-18", "2026-06-02", "2026-04-21",
  ]);
});
