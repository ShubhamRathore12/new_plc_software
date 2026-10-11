import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for the alarm-history e2e tests.
 *
 * The dev server is started automatically. Tests mount the alarm-history view
 * through the /__test harness and intercept the primeosys backend call, so no
 * live backend or auth session is required.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    // Fixed port so baseURL is deterministic and separate from a dev session
    // the user may already have on 3000.
    command: "npx next dev --port 3100",
    url: "http://localhost:3100/login",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
