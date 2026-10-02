import { describe, expect, it } from "vitest";
// @ts-expect-error plain .mjs script without types
import { isAutomatedComment } from "../scripts/is-automated-comment.mjs";

describe("isAutomatedComment", () => {
  it("flags screenshot comments", () => {
    expect(isAutomatedComment({ body: "### Screenshots · web\n![a](b)" })).toBe(
      true,
    );
    expect(isAutomatedComment({ body: "\n  ### Screenshots · web" })).toBe(
      true,
    );
  });
  it("flags preview bot authors case-insensitively", () => {
    expect(
      isAutomatedComment({ body: "hi", author: "Minions-Preview[bot]" }),
    ).toBe(true);
    expect(isAutomatedComment({ body: "hi", author: "ci" }, ["CI"])).toBe(true);
  });
  it("lets human comments through", () => {
    expect(
      isAutomatedComment({ body: "please fix the footer", author: "alice" }),
    ).toBe(false);
    expect(isAutomatedComment({ body: "see ### Screenshots · above" })).toBe(
      false,
    );
    expect(isAutomatedComment({})).toBe(false);
  });
});
