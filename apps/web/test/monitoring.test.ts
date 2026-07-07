import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { monitoring } from "../src/lib/monitoring";

describe("Monitoring Module", () => {
  let logSpy: any;
  let errorSpy: any;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize without crashing even if Sentry DSN is missing", () => {
    monitoring.init();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("[Monitoring] Sentry skipped")
    );
  });

  it("should capture exception and log it locally", () => {
    const error = new Error("Test capture error");
    monitoring.captureException(error, "TestContext");
    expect(errorSpy).toHaveBeenCalledWith(
      "[Captured Exception] TestContext:",
      error
    );
  });
});
