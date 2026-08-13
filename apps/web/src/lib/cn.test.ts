import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("une clases simples", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("descarta valores falsy", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });

  it("respeta el orden last-wins con tailwind-merge", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});