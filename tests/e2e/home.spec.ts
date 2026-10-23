import { test, expect } from "@playwright/test";

test.describe("Apex Fitness Website - E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("1. Page title, SEO metadata, and canonical tag", async ({ page }) => {
    // Title includes Apex Fitness
    await expect(page).toHaveTitle(/Apex Fitness/i);

    // Meta description exists
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute("content", /.+/);

    // Canonical link exists
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", /https?:\/\/.+/);

    // HealthClub JSON-LD Schema exists
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toBeAttached();
    const jsonText = await jsonLd.textContent();
    expect(jsonText).toContain("HealthClub");
    expect(jsonText).toContain("Apex Fitness");
  });

  test("2. Hero section displays main headline", async ({ page }) => {
    const heroHeadline = page.locator("h1");
    await expect(heroHeadline).toContainText(/Train today/i);
    await expect(heroHeadline).toContainText(/Grow tomorrow/i);
  });

  test("3. Navigation drawer opens and closes properly", async ({ page }) => {
    const menuBtn = page.getByRole("button", { name: /menu/i });
    await expect(menuBtn).toBeVisible();

    // Click to open menu
    await menuBtn.click();

    // Verify nav links inside drawer
    await expect(page.getByRole("link", { name: /offer/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /about us/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /contact/i }).first()).toBeVisible();

    // Close button appears and closes drawer
    const closeBtn = page.getByRole("button", { name: /close/i });
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();

    // Menu button returns
    await expect(page.getByRole("button", { name: /menu/i })).toBeVisible();
  });

  test("4. Pricing section switches billing frequency", async ({ page }) => {
    const pricingSection = page.locator("#pricing-section");
    await pricingSection.scrollIntoViewIfNeeded();

    const monthlyBtn = page.getByRole("button", { name: /per month/i });
    const yearlyBtn = page.getByRole("button", { name: /per year/i });

    await expect(monthlyBtn).toBeVisible();
    await expect(yearlyBtn).toBeVisible();

    // Click Monthly
    await monthlyBtn.click();
    await expect(page.getByText(/\$49|€ 44,-/).first()).toBeVisible();

    // Click Yearly
    await yearlyBtn.click();
    await expect(page.getByText(/\$39|€ 38,-/).first()).toBeVisible();
  });

  test("5. Services accordion on mobile / preview on desktop", async ({ page, isMobile }) => {
    const aanbod = page.locator("#aanbod-section");
    await aanbod.scrollIntoViewIfNeeded();

    const fitnessRow = page.locator('[data-service-index="0"]');
    await expect(fitnessRow).toBeVisible();

    if (isMobile) {
      // Tap fitness row to expand mobile accordion
      await fitnessRow.click();
      await expect(fitnessRow.getByText(/Train independently/i)).toBeVisible();
    } else {
      // On desktop, hover preview modal is attached in the DOM
      await fitnessRow.hover();
      const desktopModal = page.locator("#aanbod-section").locator(".fixed");
      await expect(desktopModal).toBeAttached();
    }
  });

  test("6. Leads API endpoint validates input", async ({ request }) => {
    // Missing required fields
    const invalidRes = await request.post("/api/leads", {
      data: { phone: "12345" },
    });
    expect(invalidRes.status()).toBe(400);

    // Valid payload
    const validRes = await request.post("/api/leads", {
      data: {
        name: "Playwright Test Runner",
        email: "test@example.com",
        phone: "+1 555-0100",
        message: "Automated test lead",
      },
    });
    expect(validRes.status()).toBe(200);
    const body = await validRes.json();
    expect(body.success).toBe(true);
  });
});
