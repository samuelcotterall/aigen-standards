---
id: playwright-md
title: Playwright — Conventions & Examples
topics: []
scope: []
version: any
sections:
  - conventions
  - examples
toolingLinks: {}
---
# Playwright — Conventions & Examples

## Conventions
1. Matrix of projects/browsers; tag tests by feature.
2. Prefer `getByRole`/`getByLabel` selectors.
3. Use fixtures/factories; mock network with MSW/route.

## Examples
```ts
import { test, expect } from "@playwright/test";
test("login flow", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("user@test.com");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL("/dashboard");
});
```

## References / Validation

The content in this document has been reviewed against authoritative sources:
- [Playwright docs](https://playwright.dev/docs/intro)

_If you disagree with any recommendation, open an issue or PR with a clear rationale and references._

