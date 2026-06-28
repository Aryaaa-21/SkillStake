import { describe, expect, it, vi } from "vitest";
import { cn, explorerTxUrl } from "../src/lib/utils";

describe("General utilities", () => {
  describe("cn (tailwind merge / clsx helper)", () => {
    it("merges tailwind classes properly", () => {
      expect(cn("px-2 py-1", "p-4")).toBe("p-4");
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });

    it("handles conditional classes", () => {
      expect(cn("px-2", true && "py-1", false && "hidden")).toBe("px-2 py-1");
    });
  });

  describe("explorerTxUrl", () => {
    it("constructs the explorer URL correctly", () => {
      // Mock the environment variable if needed, or check its output
      const url = explorerTxUrl("abcdef123456");
      expect(url).toContain("abcdef123456");
    });
  });
});
