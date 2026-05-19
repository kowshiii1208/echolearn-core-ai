import { test, expect, Page } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://eecsxipbqqqqpqnjfmmb.supabase.co";
const SUPABASE_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlY3N4aXBicXFxcXBxbmpmbW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTUxOTIsImV4cCI6MjA4MDg3MTE5Mn0.5u2tEjhpxnMpjELANfpS8tqR1ar2i6IeHI80mAjtla0";

const EXPECTED_NAV = [
  "Home",
  "EchoMind",
  "My Notes",
  "Brain Games",
  "Quizzes",
  "Resources",
];

// Create a fresh user via Supabase, then inject the session into the page's
// localStorage so the dashboard treats us as authenticated.
async function authenticate(page: Page) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
  const email = `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
  const password = "TestPassword!2026";

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(`signUp failed: ${error.message}`);
  if (!data.session) throw new Error("No session returned (email confirmation likely on)");

  const storageKey = `sb-eecsxipbqqqqpqnjfmmb-auth-token`;
  const session = data.session;

  // Load app shell first so localStorage is same-origin, then seed the token.
  await page.goto("/");
  await page.evaluate(
    ([key, value]) => window.localStorage.setItem(key, value),
    [storageKey, JSON.stringify(session)] as const
  );
}

test.describe("Dashboard navigation after AI Tools removal", () => {
  test("sidebar no longer shows AI Tools and shows the 6 remaining items", async ({ page }) => {
    await authenticate(page);
    await page.goto("/dashboard");

    const sidebar = page.locator("aside");
    await expect(sidebar.getByRole("button", { name: "Home" })).toBeVisible();

    // AI Tools entry must be gone
    await expect(sidebar.getByRole("button", { name: /^AI Tools$/ })).toHaveCount(0);

    // All expected items present in the sidebar
    for (const label of EXPECTED_NAV) {
      await expect(sidebar.getByRole("button", { name: label })).toBeVisible();
    }
  });

  test("each remaining sidebar item switches the active panel without errors", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("pageerror", (e) => consoleErrors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") consoleErrors.push(m.text());
    });

    await authenticate(page);
    await page.goto("/dashboard");
    const sidebar = page.locator("aside");
    await expect(sidebar.getByRole("button", { name: "Home" })).toBeVisible();

    const order = ["EchoMind", "My Notes", "Brain Games", "Quizzes", "Resources", "Home"];

    for (const nav of order) {
      await sidebar.getByRole("button", { name: nav }).click();
      // Wait briefly for the panel to mount; verify <main> renders non-empty content
      try {
        await expect.poll(
          async () => ((await page.locator("main").textContent()) ?? "").trim().length,
          { timeout: 7000, intervals: [200, 400, 800] }
        ).toBeGreaterThan(0);
      } catch (err) {
        const html = await page.locator("main").innerHTML();
        throw new Error(`Panel "${nav}" rendered empty. main innerHTML:\n${html.slice(0, 500)}`);
      }
    }

    // Ignore noisy non-blocking errors (network probes, favicon, etc.)
    const blocking = consoleErrors.filter(
      (e) => !/favicon|Failed to load resource|net::ERR_|ResizeObserver/i.test(e)
    );
    expect(blocking).toEqual([]);
  });
});
