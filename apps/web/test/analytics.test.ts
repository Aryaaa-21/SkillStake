import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { analytics } from "../src/lib/analytics";

describe("Analytics Module", () => {
  let logSpy: any;
  let warnSpy: any;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize without crashing even if environment variables are missing", () => {
    analytics.init();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("[Analytics] Google Analytics skipped")
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("[Analytics] Microsoft Clarity skipped")
    );
  });

  it("should track events and log them locally", () => {
    analytics.trackEvent("test_event", { foo: "bar" });
    expect(logSpy).toHaveBeenCalledWith(
      "[Analytics Event] test_event",
      { foo: "bar" }
    );
  });
});
