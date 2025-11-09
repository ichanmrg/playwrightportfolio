# E2E Smoke Tests – README

## Overview
This repository contains Playwright end‑to‑end **smoke tests** for the websites’s most critical user paths. The goal is to provide a fast, reliable signal that the app loads and the core shopping flow works.

## Test Strategy (what & why)
**Scope (Smoke)**
- **App loads / health check** – navigates to `BASE_URL` and verifies key UI elements render. *Why:* early failure if the app is down or misconfigured.
- **Login** – authenticates with a test account. *Why:* unlocks most flows; catches auth/regression issues early.
- **Add to Cart** – adds item(s) by name and verifies cart badge/line items. *Why:* core revenue path.
- **Remove from Cart** – removes item(s) and verifies totals update. *Why:* state transitions must be reversible.
- **Checkout (happy path)** – completes a basic purchase and verifies confirmation page. *Why:* end‑to‑end validation of the primary funnel. This also checks if the added items are correct (including details), the subtotal, the tax, and the total.
- **Logout** – ends the session and asserts user is returned to the public state. *Why:* security/session integrity.

**Out of scope (for smoke)**
- Exhaustive permutations, negative/edge cases, visual testing, cross‑browser matrix, performance/load. These can be added as **regression** or **extended** suites later.


## Configuration
Tests are configured via environment variables so the same suite can run against different environments (dev/stage/prod), meaning the tests are ready for expansion.

## Prerequisites
- **Node.js 18+** (LTS recommended)
- **npm** (or pnpm/yarn, adapt commands accordingly)
- Project dependencies installed: `npm install`
- Playwright browsers installed: `npx playwright install`  
  (Linux CI containers: `npx playwright install --with-deps`)


## Running the tests

### Option A — CLI via `dotenvx` (recommended)
We use **dotenvx** to load environment variables at runtime (from `.env`, `.env.local`, or a file you specify). If you’re using encrypted env files, dotenvx can also decrypt them using a key from `.env.keys`.

**Note:** The file `.env.keys`, in practice, should not be included in the repository and `DOTENV_PRIVATE_KEY` should only be defined as an environment variable. Since this is a practice test website, I included the file to decode the variables needed tp run the tests should the user wants to run the test using the first option.

**Run the entire suite:**
```bash
npx dotenvx run -- npx playwright test
```

**Handy variants:**
```bash
# Specify a different env file (e.g., .env.dev)
npx dotenvx run -f .env.dev -- npx playwright test

# If using encrypted envs and a key file:
npx dotenvx run -f .env.dev -fk .env.keys -- npx playwright test

# Run a single spec in headed mode
npx dotenvx run -- npx playwright test tests/login.spec.ts --headed

# Filter by title
npx dotenvx run -- npx playwright test -g "Add to Cart"

# UI mode (great for debugging)
npx dotenvx run -- npx playwright test --ui
```

### Option B — VS Code Test Explorer
1. Install **Playwright Test for VS Code** (official extension).
2. Open the repo in VS Code and ensure your `.env` (or `.env.dev`) exists.
3. Open the **Testing** view (beaker icon).
4. Click **Run** on the whole suite or any individual test.  
   > If your tests rely on env vars, start VS Code from a shell that has them loaded, or configure the extension to use `dotenvx` by launching via:  
   `npx dotenvx run -- code .`
5. For the sake of reunning the practice tests easily using this method, I hardcoded the `password` in case the `DEFAULT_PASSWORD` in the `dotenvx` is not loaded. You can find the constant in `login.spec.ts` under `defaultPassword`.

## Reports
- Allure Reports (recommended):
```bash
npx allure serve
```
- Playwright HTML report: after a run, open with:
```bash
npx playwright show-report
```
- Trace viewer (if enabled in config or on failure):
```bash
npx playwright show-trace path/to/trace.zip
```

## Troubleshooting
- **Browsers not installed**: run `npx playwright install`.
- **Missing env vars**: ensure `.env` (or specified file) contains all required keys and paths are correct.
- **Encrypted envs**: if using encrypted files, include a valid `.env.keys` or set the private key in your shell.
