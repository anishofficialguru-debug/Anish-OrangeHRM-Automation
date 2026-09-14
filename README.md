# TEST_AT – OrangeHRM Senior QA Automation Framework

**Tech Stack:** Playwright + TypeScript  
**Target Application:** [OrangeHRM Open Source Demo](https://opensource-demo.orangehrmlive.com)  
**Credentials:** `Admin` / `admin123`

---

## 🎯 Objective Covered

| Part | Requirement | Status |
|------|-------------|--------|
| 1 | Advanced E2E Employee Lifecycle | ✅ Authentication, Create, Role validation, Update, API verification, Delete |
| 2 | Framework Design (POM, config, utils) | ✅ Clean scalable structure |
| 3 | CI/CD (GitHub Actions) | ✅ Install, execute, reports, artifacts, parallelization |
| 4 | Test Stability | ✅ Retries, smart waits, screenshots/videos on failure |
| 5 | Performance (Bonus) | ✅ k6 scripts for Login + Employee endpoints |
| 6 | Reporting & Observability | ✅ HTML reports, screenshots, videos, tags, env-based execution |

---

## 📁 Project Structure

```
test-at-orangehrm-automation/
├── .github/workflows/ci.yml      # CI pipeline (push, PR, nightly)
├── config/
│   ├── .env                      # Default
│   ├── .env.demo                 # Demo environment
│   └── .env.example
├── src/
│   ├── pages/                    # Page Object Model
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   ├── PIMPage.ts
│   │   └── DashboardPage.ts
│   ├── fixtures/                 # Custom Playwright fixtures
│   ├── api/                      # API helpers
│   ├── utils/                    # Test data + smart waits
│   └── types/                    # TypeScript interfaces
├── tests/
│   ├── e2e/                      # Full employee lifecycle
│   └── api/                      # API verification
├── k6/                           # Performance tests
├── reports/                      # HTML + JUnit + JSON
├── playwright.config.ts
├── package.json
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ (20 LTS recommended)
- npm 9+
- (Optional) k6 for performance tests: https://k6.io/docs/get-started/installation/

### 1. Clone / Download
```bash
# After creating your GitHub repo, push this folder or:
git init
git add .
git commit -m "TEST_AT: Initial OrangeHRM automation framework"
```

### 2. Install dependencies
```bash
npm install
npx playwright install chromium
# or for all browsers:
npx playwright install
```

### 3. Environment configuration
```bash
# Already provided for demo. To override:
cp config/.env.example config/.env.demo
# Edit BASE_URL, credentials if needed
```

---

## ▶️ Execution Steps

### Run all tests
```bash
npm test
```

### Run by tag
```bash
npm run test:smoke
npm run test:regression
npx playwright test --grep @e2e
npx playwright test --grep @api
```

### Run specific suite
```bash
npm run test:e2e
npm run test:api
```

### Headed / Debug / UI mode
```bash
npm run test:headed
npm run test:debug
npm run test:ui
```

### Environment-based execution
```bash
TEST_ENV=demo npm test
# or
BASE_URL=https://your-instance.com ADMIN_USERNAME=Admin ADMIN_PASSWORD=xxx npm test
```

### View HTML report
```bash
npm run report
# or
npx playwright show-report reports/html
```

### Performance tests (k6)
```bash
# Install k6 first, then:
npm run perf
# or individually:
k6 run k6/login-api.js
k6 run k6/employee-create-api.js
```

---

## 🏗️ Key Design Decisions

1. **Playwright + TypeScript**  
   Best-in-class auto-waiting, parallel execution, tracing, video, and first-class TypeScript support. Ideal for senior-level maintainability.

2. **Page Object Model + Fixtures**  
   - `BasePage` centralizes common actions and smart waits.  
   - Feature pages (`LoginPage`, `PIMPage`) encapsulate locators and business flows.  
   - Custom fixtures provide authenticated sessions and unique test data per test.

3. **Naming Convention – `TEST_AT`**  
   - All test titles prefixed with `TEST_AT_XXX`.  
   - Generated employee IDs and usernames start with `TEST_AT_`.  
   - Makes filtering, reporting and ownership clear.

4. **Environment-based Configuration**  
   - `config/.env.{env}` files loaded via `dotenv` in `playwright.config.ts`.  
   - Easy switch between demo / staging / production-like instances.

5. **Test Data Management**  
   - `@faker-js/faker` generates unique first/last names, usernames and passwords.  
   - Timestamp + random suffix prevents collisions in parallel runs.

6. **Stability & Reliability**  
   - Playwright retries (`retries: 2` in CI).  
   - Custom `SmartWaits` (network idle, success toast, retryAction).  
   - Screenshots + video + trace retained **only on failure**.

7. **CI/CD (GitHub Actions)**  
   - Triggers: push, pull_request, nightly schedule, manual.  
   - 4-way sharding for parallelization.  
   - Artifacts: HTML report, screenshots, videos, JUnit/JSON results.  
   - Fail-fast disabled so all shards report results.

8. **Flaky Test Strategy (documented below)**

---

## 🛡️ Test Stability & Flaky Test Strategy

### Built-in mechanisms
- Playwright auto-waiting + explicit `SmartWaits`
- Global retries (1 local, 2 in CI)
- `waitForSuccessToast` after create/update/delete
- Unique test data every run

### Flaky Test Detection
1. Monitor CI history for tests that fail intermittently.
2. Use Playwright trace viewer (`npx playwright show-trace`) on failed runs.
3. Tag suspects with `@flaky` and quarantine them temporarily.
4. Track failure rate in the JSON/JUnit reports over time.

### Mitigation Strategy
| Cause | Mitigation |
|-------|------------|
| Timing / race | Prefer Playwright auto-wait + `networkidle` + success toast |
| Shared state | Unique data (`TEST_AT_*`) + cleanup (delete employee) |
| Demo site instability | Retries + soft API assertions |
| Locator fragility | Prefer role/text + stable CSS; avoid brittle XPath |
| Parallel interference | Isolated browser contexts + unique data |

---

## 📊 Reporting & Observability

- **HTML Report** – `reports/html` (screenshots, videos, traces embedded)
- **JUnit XML** – for CI systems
- **JSON results** – for custom dashboards
- **Tags** – `@smoke`, `@regression`, `@e2e`, `@api`, `@negative`
- **Artifacts** uploaded on every CI run (retained 14 days)

---

## 📈 Performance Thresholds (k6)

| Test | p95 latency | Error rate |
|------|-------------|------------|
| Login page | < 3 s | < 10 % |
| Employee endpoints | < 4 s | < 15 % |

---

## 📝 Evaluation Mapping

- **Architecture & Framework Design** → POM, fixtures, utils, env config, clean structure  
- **Code Quality** → TypeScript strict, readable steps, naming convention `TEST_AT`  
- **CI/CD** → GitHub Actions with parallel shards, reports, artifacts  
- **Test Coverage** → Full employee lifecycle + smoke + API + negative  
- **Reporting** → HTML + screenshots/videos + tags + env execution  
- **Engineering Judgment** → Realistic handling of public demo limitations, retry strategy, documentation  

---

## 📤 Submission Notes

1. Create a **new public (or private with access) GitHub repository**.
2. Push this entire folder.
3. Ensure the Actions tab shows a green run (or attach the HTML report + screenshots).
4. Share the repository URL.

**Author:** Senior QA Automation Engineer (TEST_AT framework)  
**Timeline:** Designed to be completed and production-ready within the 3-day assignment window.
