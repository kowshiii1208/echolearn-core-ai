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

    // Wait for the sidebar to render
    await expect(page.getByRole("button", { name: "Home" })).toBeVisible();

    // AI Tools entry must be gone
    await expect(page.getByRole("button", { name: /^AI Tools$/ })).toHaveCount(0);

    // All expected items present
    for (const label of EXPECTED_NAV) {
      await expect(page.getByRole("button", { name: label })).toBeVisible();
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
    await expect(page.getByRole("button", { name: "Home" })).toBeVisible();

    // Markers we expect on each panel after navigation
    const checks: Array<{ nav: string; expectText: RegExp }> = [
      { nav: "EchoMind", expectText: /EchoMind|Ask anything/i },
      { nav: "My Notes", expectText: /Notes/i },
      { nav: "Brain Games", expectText: /Games|Brain/i },
      { nav: "Quizzes", expectText: /Quiz/i },
      { nav: "Resources", expectText: /Resources|Courses/i },
      { nav: "Home", expectText: /Dashboard|morning|afternoon|evening/i },
    ];

    for (const { nav, expectText } of checks) {
      await page.getByRole("button", { name: nav }).first().click();
      await expect(page.locator("main")).toContainText(expectText, { timeout: 5000 });
    }

    // No "tools" panel should ever render and no runtime errors should fire
    expect(consoleErrors.filter((e) => !/favicon|Failed to load resource/i.test(e))).toEqual([]);
  });
});
