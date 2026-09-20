import { describe, expect, it } from "vitest";
import { loadConfig } from "./config.js";

const environment = {
  DATABASE_URL: "postgresql://test:test@localhost/test",
  INTEGRATION_ADMIN_TOKEN: "test-token-for-local-config-validation"
};

describe("worker lease configuration", () => {
  it("uses a five-minute lease for existing installations", () => {
    expect(loadConfig(environment).WORKER_LEASE_MS).toBe(300_000);
  });

  it("accepts an explicit lease in milliseconds", () => {
    expect(loadConfig({ ...environment, WORKER_LEASE_MS: "60000" }).WORKER_LEASE_MS).toBe(60_000);
  });

  it.each(["0", "-1", "999", "3600001", "1500.5", "invalid"])(
    "rejects an unusable lease: %s",
    (value) => {
      expect(() => loadConfig({ ...environment, WORKER_LEASE_MS: value })).toThrow();
    }
  );
});
