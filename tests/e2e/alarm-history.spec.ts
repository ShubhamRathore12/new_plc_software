import { test, expect, type Page } from "@playwright/test";

/**
 * E2E coverage for the alarm-history view (FaultLogsPaginated).
 *
 * Reproduces the "it doesn't show anything" report by driving the four
 * terminal states against mocked primeosys-backend responses:
 *   - results   → rows render, counters resolve
 *   - empty     → explicit "no alarms" message, not a blank panel
 *   - error     → explicit failure message
 *   - dark mode → surface uses theme tokens, not hardcoded white
 *
 * The component now reads straight from the primeosys backend
 * (/api/all700data/paginatedSmart200), so that is the request we intercept.
 */

const MACHINE = "GTPL-159-gT-650T-S7-1200";
const HARNESS = `/test-harness/alarm-history?machine=${encodeURIComponent(MACHINE)}`;

// Matches the primeosys backend call regardless of host/port/query.
const BACKEND = "**/api/all700data/paginatedSmart200**";

/**
 * A raw record shaped like the real 650T table: enum columns stored as the
 * strings "True"/"False", keyed by the actual PLC input-bit column names
 * (e.g. High_pressure_fault_I1_3). The old config used generic labels with
 * zero overlap with these, which is the bug this suite guards against.
 */
function faultRecord(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    created_at: "2024-05-01T10:30:00Z",
    High_pressure_fault_I1_3: "True",
    Low_pressure_fault_I1_1: "False",
    ...overrides,
  };
}

async function mockBackend(
  page: Page,
  body: unknown,
  init: { status?: number } = {}
) {
  await page.route(BACKEND, async (route) => {
    await route.fulfill({
      status: init.status ?? 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
}

test.describe("alarm history", () => {

  test("renders fault rows when the backend returns records", async ({
    page,
  }) => {
    await mockBackend(page, {
      data: [faultRecord(), faultRecord({ id: 2 })],
      total: 2,
      totalPages: 1,
    });

    await page.goto(HARNESS);

    // The panel resolves to the results state: at least one ACTIVE ALARM badge.
    await expect(page.getByText("ACTIVE ALARM").first()).toBeVisible();
    // Counters resolve rather than sticking on a blank/zero loading view.
    await expect(page.getByText(/entr(y|ies)/i)).toBeVisible();
    // The empty and error messages must NOT be present.
    await expect(
      page.getByText("No alarms recorded in the selected period.")
    ).toHaveCount(0);
  });

  test("shows an explicit empty message when there are no faults", async ({
    page,
  }) => {
    await mockBackend(page, { data: [], total: 0, totalPages: 0 });

    await page.goto(HARNESS);

    await expect(
      page.getByText("No alarms recorded in the selected period.")
    ).toBeVisible();
    await expect(page.getByText("ACTIVE ALARM")).toHaveCount(0);
  });

  test("shows an error message when the backend fails", async ({ page }) => {
    await mockBackend(page, { error: "boom" }, { status: 500 });

    await page.goto(HARNESS);

    await expect(
      page.getByText("The alarm history could not be loaded.")
    ).toBeVisible();
  });

  test("surface uses theme tokens in dark mode (no hardcoded white)", async ({
    page,
  }) => {
    await mockBackend(page, {
      data: [faultRecord()],
      total: 1,
      totalPages: 1,
    });

    // Force dark before the client paints so the themed tokens apply.
    await page.emulateMedia({ colorScheme: "dark" });
    await page.addInitScript(() => {
      document.documentElement.classList.add("dark");
    });

    await page.goto(HARNESS);
    await expect(page.getByText("ACTIVE ALARM").first()).toBeVisible();

    // The outer card background must resolve from the dark theme, i.e. it must
    // not be pure white (rgb(255,255,255)) the way the old bg-white did.
    const card = page.locator(".bg-card").first();
    const bg = await card.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );
    expect(bg).not.toBe("rgb(255, 255, 255)");
  });
});
