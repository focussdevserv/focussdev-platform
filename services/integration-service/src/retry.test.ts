import { describe, expect, it } from "vitest";
import { retryDelayMs } from "./retry.js";

describe("retryDelayMs", () => {
  it("aplica backoff exponencial com jitter controlado", () => {
    expect(retryDelayMs(1, () => 0)).toBe(500);
    expect(retryDelayMs(2, () => 1)).toBe(2_000);
    expect(retryDelayMs(4, () => 0.5)).toBe(6_000);
  });

  it("limita o atraso em quinze minutos", () => {
    expect(retryDelayMs(30, () => 1)).toBe(900_000);
  });
});
