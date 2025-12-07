# Cypress Test Automation Framework

A comprehensive, production-ready test automation framework built with Cypress and JavaScript. This framework supports both UI and API testing with YAML-based locators, multiple reporting options, and seamless CI/CD integration.

## 📋 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running Tests](#-running-tests)
- [YAML Locators](#-yaml-locators)
- [Page Object Model](#-page-object-model)
- [API Testing](#-api-testing)
- [Reporting](#-reporting)
- [Allure Reports](#-allure-reports)
- [Screenshots](#-screenshots)
- [Session Management](#-session-management)
- [Attaching to Running Browser](#-attaching-to-running-browser)
- [CI/CD Integration](#-cicd-integration)
  - [GitHub Actions](#github-actions)
  - [Jenkins](#jenkins)
  - [Azure DevOps](#azure-devops)
  - [AWS CodePipeline](#aws-codepipeline)
- [Email Reports](#-email-reports)
- [Best Practices](#-best-practices)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

- **Cypress 13+** - Latest Cypress version with modern features
- **JavaScript** - Easy to learn and maintain
- **YAML Locators** - Simplified, maintainable element locators
- **Page Object Model** - Clean separation of concerns
- **API Testing** - Full REST API testing support
- **Multiple Environments** - QA, Staging, Production configurations
- **Session Management** - Login once, reuse across tests
- **Allure Reports** - Beautiful, detailed test reports
- **Mochawesome Reports** - Alternative HTML reporting
- **Screenshot Capture** - Automatic screenshots on failure
- **Video Recording** - Full test execution videos
- **CI/CD Ready** - GitHub Actions, Jenkins, Azure, AWS support
- **Email Notifications** - Send reports via email
- **Error Handling** - Comprehensive error handling utilities
- **Parallel Execution** - Run tests in parallel

---

## 📁 Project Structure

```
cypress-test-automation/
├── cypress/
│   ├── config/                    # Environment configurations
│   │   ├── qa.json
│   │   ├── staging.json
│   │   └── prod.json
│   ├── e2e/                       # Test files
│   │   ├── api/                   # API tests
│   │   │   ├── users.cy.js
│   │   │   └── posts.cy.js
│   │   └── ui/                    # UI tests
│   │       ├── login.cy.js
│   │       └── home.cy.js
│   ├── fixtures/                  # Test data
│   │   ├── users.json
│   │   └── testData.json
│   ├── locators/                  # YAML locator files
│   │   ├── login.yaml
│   │   ├── home.yaml
│   │   └── common.yaml
│   ├── pages/                     # Page Objects
│   │   ├── BasePage.js
│   │   ├── LoginPage.js
│   │   └── HomePage.js
│   ├── reports/                   # Generated reports
│   ├── screenshots/               # Failure screenshots
│   ├── videos/                    # Test videos
│   └── support/
│       ├── commands.js            # Custom commands
│       ├── e2e.js                 # Support file
│       └── utils/                 # Utility functions
│           ├── apiHelper.js
│           ├── errorHandler.js
│           └── locatorHelper.js
├── scripts/
│   └── sendEmailReport.js         # Email report sender
├── .github/
│   └── workflows/
│       └── cypress-tests.yml      # GitHub Actions
├── allure-results/                # Allure results
├── allure-report/                 # Allure HTML report
├── .env.example                   # Environment template
├── .eslintrc.js                   # ESLint config
├── .gitignore
├── azure-pipelines.yml            # Azure DevOps pipeline
├── aws-buildspec.yml              # AWS CodeBuild spec
├── cypress.config.js              # Cypress configuration
├── cypress.env.json.example       # Cypress env template
├── Jenkinsfile                    # Jenkins pipeline
├── package.json
└── README.md
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9 or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Chrome/Firefox/Edge** browser

### Verify Installation

```bash
node --version    # Should be v18+
npm --version     # Should be v9+
git --version
```

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/amitbad/Javascript-Cypress-Automation-Framework.git
cd cypress-test-automation
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Cypress
- Allure reporter
- Mochawesome reporter
- YAML parser
- And other dependencies

### Step 3: Verify Cypress Installation

```bash
npx cypress verify
npx cypress info
```

### Step 4: Configure Environment

```bash
# Copy environment template
cp .env.example .env
cp cypress.env.json.example cypress.env.json

# Edit with your values
nano .env  # or use any text editor
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Application URLs
CYPRESS_BASE_URL=https://your-app.com
CYPRESS_API_BASE_URL=https://api.your-app.com

# Test Credentials
CYPRESS_TEST_USERNAME=testuser@example.com
CYPRESS_TEST_PASSWORD=your_password

# Cypress Dashboard (optional)
CYPRESS_PROJECT_ID=your_project_id
CYPRESS_RECORD_KEY=your_record_key

# Email Configuration (for reports)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_RECIPIENTS=recipient@example.com
```

### Cypress Environment File

Create `cypress.env.json`:

```json
{
  "username": "testuser@example.com",
  "password": "your_password",
  "apiKey": "your_api_key"
}
```

### Environment-Specific Configuration

Edit files in `cypress/config/`:

- `qa.json` - QA environment settings
- `staging.json` - Staging environment settings
- `prod.json` - Production environment settings

---

## 🏃 Running Tests

### Open Cypress Test Runner (Interactive Mode)

```bash
npm run cy:open
```

### Run All Tests (Headless)

```bash
npm run cy:run
```

### Run Tests with Specific Browser

```bash
npm run cy:run:chrome    # Chrome
npm run cy:run:firefox   # Firefox
npm run cy:run:edge      # Edge
npm run cy:run:electron  # Electron (default)
```

### Run Tests by Type

```bash
npm run test:smoke       # Smoke tests only
npm run test:regression  # Regression tests only
npm run test:api         # API tests only
npm run test:ui          # UI tests only
```

### Run Tests by Environment

```bash
npm run test:qa          # QA environment
npm run test:staging     # Staging environment
npm run test:prod        # Production environment
```

### Run Specific Test File

```bash
npx cypress run --spec "cypress/e2e/ui/login.cy.js"
```

### Run Tests with Tags

```bash
npx cypress run --env grepTags=@smoke
npx cypress run --env grepTags=@regression
npx cypress run --env grepTags="@smoke+@login"  # AND
npx cypress run --env grepTags="@smoke @login"  # OR
```

### Run Tests in Headed Mode

```bash
npm run cy:run:headed
# or
npx cypress run --headed
```

---

## 📍 YAML Locators

### Why YAML Locators?

- **Readable** - Easy to understand and maintain
- **Centralized** - All locators in one place per page
- **Flexible** - Supports CSS, XPath, and text selectors
- **Reusable** - Share locators across tests

### Locator File Format

```yaml
# cypress/locators/login.yaml
loginPage:
  # Page URL
  url: "/login"
  
  # CSS Selectors (default)
  usernameInput: "[data-testid='username-input']"
  passwordInput: "#password"
  loginButton: ".btn-login"
  
  # XPath Selectors
  submitBtn: "xpath=//button[@type='submit']"
  
  # Text-based Selectors
  forgotLink: "text=Forgot Password"
```

### Using Locators in Tests

```javascript
// Using custom commands
cy.getByLocator('login', 'usernameInput').type('user@test.com');
cy.clickByLocator('login', 'loginButton');

// Using Page Objects
import LoginPage from '../../pages/LoginPage';
LoginPage.enterUsername('user@test.com');
LoginPage.clickLoginButton();
```

### Best Practices for Locators

1. **Prefer data-testid attributes** - Most stable
2. **Avoid dynamic IDs** - They change on each build
3. **Use semantic selectors** - Describe the element's purpose
4. **Keep locators simple** - Avoid complex XPath

---

## 🏗️ Page Object Model

### Base Page

All page objects extend `BasePage`:

```javascript
// cypress/pages/BasePage.js
class BasePage {
  constructor() {
    this.pageName = 'common';
  }
  
  visit(path) { cy.visit(path); }
  getElement(key) { return getElement(this.pageName, key); }
  click(key) { return this.getElement(key).click(); }
  type(key, text) { return this.getElement(key).clear().type(text); }
}
```

### Creating a Page Object

```javascript
// cypress/pages/LoginPage.js
import BasePage from './BasePage';

class LoginPage extends BasePage {
  constructor() {
    super();
    this.pageName = 'login';
  }
  
  enterUsername(username) {
    this.type('usernameInput', username);
    return this;
  }
  
  login(username, password) {
    this.enterUsername(username);
    this.enterPassword(password);
    this.clickLoginButton();
    return this;
  }
}

export default new LoginPage();
```

### Using Page Objects in Tests

```javascript
import LoginPage from '../../pages/LoginPage';
import HomePage from '../../pages/HomePage';

describe('Login Tests', () => {
  it('should login successfully', () => {
    LoginPage.visit();
    LoginPage.login('user@test.com', 'password123');
    HomePage.verifyUserLoggedIn();
  });
});
```

---

## 🔌 API Testing

### Making API Requests

```javascript
// GET request
cy.apiRequest({
  method: 'GET',
  url: '/api/users'
}).then(response => {
  expect(response.status).to.eq(200);
});

// POST request
cy.apiRequest({
  method: 'POST',
  url: '/api/users',
  body: { name: 'John', email: 'john@test.com' }
});

// Authenticated request
cy.apiRequestWithToken({
  method: 'GET',
  url: '/api/profile'
});
```

### API Test Example

```javascript
describe('Users API', () => {
  it('should create user', { tags: '@api' }, () => {
    cy.apiRequest({
      method: 'POST',
      url: `${Cypress.env('apiBaseUrl')}/users`,
      body: { name: 'Test User', email: 'test@example.com' }
    }).then(response => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
    });
  });
});
```

---

## 📊 Reporting

### Mochawesome Reports

Generated automatically after test runs.

```bash
# Generate merged report
npm run report:full

# View report
open cypress/reports/html/report.html
```

### Report Location

- **JSON**: `cypress/reports/mocha/*.json`
- **HTML**: `cypress/reports/html/report.html`

---

## 📈 Allure Reports

### Installing Allure CLI

#### macOS

```bash
brew install allure
```

#### Windows

```bash
# Using Scoop
scoop install allure

# Using Chocolatey
choco install allure
```

#### Linux

```bash
# Download and extract
wget https://github.com/allure-framework/allure2/releases/download/2.25.0/allure-2.25.0.tgz
tar -zxvf allure-2.25.0.tgz
export PATH=$PATH:$(pwd)/allure-2.25.0/bin
```

#### Using npm (Alternative)

```bash
# Already included in package.json
npx allure --version
```

### Generating Allure Reports

```bash
# Run tests (generates allure-results)
npm run cy:run

# Generate HTML report
npm run allure:generate

# Open report in browser
npm run allure:open

# Generate and open in one command
npm run allure:serve
```

### Allure Report Features

- Test execution timeline
- Test categories and suites
- Detailed step-by-step execution
- Screenshots and attachments
- Environment information
- Trend graphs (with history)

---

## 📸 Screenshots

### Automatic Screenshots

Screenshots are automatically captured on test failure.

### Manual Screenshots

```javascript
// Full page screenshot
cy.takeFullPageScreenshot('homepage');

// Viewport screenshot
cy.takeViewportScreenshot('modal-open');

// Element screenshot
cy.takeElementScreenshot('#login-form', 'login-form');

// Using Cypress directly
cy.screenshot('custom-name');
```

### Screenshot Location

- **Path**: `cypress/screenshots/`
- **Naming**: `{spec-name}/{test-name} (failed).png`

### Configuration

In `cypress.config.js`:

```javascript
{
  screenshotsFolder: 'cypress/screenshots',
  screenshotOnRunFailure: true,
  trashAssetsBeforeRuns: true
}
```

---

## 🔐 Session Management

### Login Once, Reuse Across Tests

```javascript
// Using cy.session (Recommended)
beforeEach(() => {
  cy.session('userSession', () => {
    cy.visit('/login');
    cy.get('#username').type('user@test.com');
    cy.get('#password').type('password123');
    cy.get('#login-btn').click();
    cy.url().should('not.include', '/login');
  }, {
    cacheAcrossSpecs: true  // Share session across spec files
  });
});
```

### API-Based Login (Faster)

```javascript
cy.session('apiLogin', () => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: { username: 'user', password: 'pass' }
  }).then(response => {
    window.localStorage.setItem('token', response.body.token);
  });
});
```

### Custom Login Command

```javascript
// In commands.js
Cypress.Commands.add('loginOnce', (username, password) => {
  cy.session([username, password], () => {
    cy.login(username, password);
  }, {
    cacheAcrossSpecs: true
  });
});

// In tests
beforeEach(() => {
  cy.loginOnce('user@test.com', 'password123');
});
```

---

## 🔗 Attaching to Running Browser

### Why Attach to Running Browser?

- **Save time** - No need to login repeatedly
- **Debug faster** - Inspect application state
- **Manual + Automated** - Combine manual setup with automation

### Method 1: Using cy.session (Recommended)

```javascript
// Session is preserved across tests
cy.session('mySession', () => {
  // Login or setup steps
}, {
  cacheAcrossSpecs: true
});
```

### Method 2: Chrome Remote Debugging

#### Step 1: Start Chrome with Remote Debugging

```bash
# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-debug

# Windows
"C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --remote-debugging-port=9222 ^
  --user-data-dir=C:\temp\chrome-debug

# Linux
google-chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug
```

#### Step 2: Manually Login in Browser

Navigate to your application and login manually.

#### Step 3: Run Cypress Connecting to Browser

```bash
# Create a Cypress plugin to connect
npx cypress open --browser chrome
```

### Method 3: Preserve Cookies

```javascript
// In cypress/support/e2e.js
Cypress.Cookies.defaults({
  preserve: ['session', 'auth_token', 'remember_token']
});
```

### Method 4: Using experimentalSessionAndOrigin

```javascript
// cypress.config.js
{
  e2e: {
    experimentalSessionAndOrigin: true
  }
}
```

---

## 🔄 CI/CD Integration

### GitHub Actions

#### Setup

1. **Add Secrets** in GitHub Repository Settings:
   - `CYPRESS_BASE_URL`
   - `CYPRESS_USERNAME`
   - `CYPRESS_PASSWORD`
   - `CYPRESS_API_BASE_URL`
   - `CYPRESS_RECORD_KEY` (optional)

2. **Workflow File**: `.github/workflows/cypress-tests.yml`

#### Manual Trigger (Default)

The workflow is configured for **manual trigger only**. It will NOT run automatically on push/PR.

To run manually:
1. Go to **Actions** tab in GitHub
2. Select **Cypress E2E Tests** workflow
3. Click **Run workflow**
4. Select options (environment, browser, test type)
5. Click **Run workflow**

#### Enable Automatic Triggers

To enable automatic runs, edit `.github/workflows/cypress-tests.yml`:

```yaml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:  # Keep manual trigger option
```

#### View Results

- **Artifacts**: Screenshots, videos, reports
- **GitHub Pages**: Allure reports (if configured)

---

### Jenkins

#### Prerequisites

1. **Jenkins Plugins**:
   - NodeJS Plugin
   - HTML Publisher Plugin
   - Allure Plugin
   - Credentials Plugin

2. **Configure Node.js** in Jenkins:
   - Manage Jenkins → Global Tool Configuration
   - Add NodeJS installation named `NodeJS-20`

3. **Add Credentials**:
   - Manage Jenkins → Credentials
   - Add credentials:
     - `cypress-base-url`
     - `cypress-username`
     - `cypress-password`
     - `cypress-api-base-url`

#### Create Pipeline Job

1. New Item → Pipeline
2. Pipeline Definition: Pipeline script from SCM
3. SCM: Git
4. Repository URL: Your repo URL
5. Script Path: `Jenkinsfile`

#### Run Pipeline

1. Click **Build with Parameters**
2. Select:
   - Environment (qa/staging/prod)
   - Browser (chrome/firefox/edge)
   - Test Type (all/smoke/regression/api)
3. Click **Build**

#### View Reports

- **Mochawesome**: Build → Mochawesome Report
- **Allure**: Build → Allure Report
- **Artifacts**: Build → Artifacts

---

### Azure DevOps

#### Prerequisites

1. **Azure DevOps Project** with Pipelines enabled
2. **Variable Groups** or **Pipeline Variables**:
   - `CYPRESS_BASE_URL`
   - `CYPRESS_USERNAME`
   - `CYPRESS_PASSWORD`
   - `CYPRESS_API_BASE_URL`

#### Setup Pipeline

1. **Pipelines** → **New Pipeline**
2. Select repository
3. Select **Existing Azure Pipelines YAML file**
4. Path: `/azure-pipelines.yml`
5. **Save** (not Run)

#### Configure Variables

1. **Edit Pipeline** → **Variables**
2. Add variables:
   ```
   CYPRESS_BASE_URL = https://your-app.com
   CYPRESS_USERNAME = testuser (mark as secret)
   CYPRESS_PASSWORD = password (mark as secret)
   CYPRESS_API_BASE_URL = https://api.your-app.com
   ```

#### Run Pipeline Manually

1. **Pipelines** → Select your pipeline
2. Click **Run pipeline**
3. Select parameters:
   - Environment
   - Browser
   - Test Type
4. Click **Run**

#### View Results

- **Tests** tab: Test results summary
- **Artifacts**: Published artifacts (screenshots, videos, reports)

---

### AWS CodePipeline

#### Prerequisites

1. **AWS Account** with CodeBuild and CodePipeline access
2. **S3 Bucket** for artifacts
3. **Secrets Manager** or **Parameter Store** for credentials

#### Store Secrets

Using AWS Secrets Manager:

```bash
aws secretsmanager create-secret \
  --name cypress-secrets \
  --secret-string '{
    "CYPRESS_BASE_URL": "https://your-app.com",
    "CYPRESS_USERNAME": "testuser",
    "CYPRESS_PASSWORD": "password",
    "CYPRESS_API_BASE_URL": "https://api.your-app.com"
  }'
```

#### Create CodeBuild Project

1. **CodeBuild** → **Create build project**
2. **Source**: GitHub (connect your repo)
3. **Environment**:
   - Managed image
   - Operating system: Ubuntu
   - Runtime: Standard
   - Image: aws/codebuild/standard:7.0
4. **Buildspec**: Use `aws-buildspec.yml`
5. **Artifacts**: S3 bucket

#### Create CodePipeline

1. **CodePipeline** → **Create pipeline**
2. **Source**: GitHub (your repo)
3. **Build**: Select your CodeBuild project
4. **Deploy**: Skip (or configure as needed)

#### Environment Variables

In CodeBuild project:
- `ENVIRONMENT`: qa
- `BROWSER`: chrome
- `TEST_TYPE`: all

#### Run Pipeline

Pipeline runs automatically on code push, or:
1. **CodePipeline** → Select pipeline
2. Click **Release change**

#### View Results

- **CodeBuild logs**: Real-time execution logs
- **S3 Artifacts**: Test reports, screenshots, videos

---

## 📧 Email Reports

### Configuration

1. **Gmail Setup** (Recommended):
   - Enable 2-Factor Authentication
   - Generate App Password: Google Account → Security → App Passwords
   - Use App Password as `SMTP_PASS`

2. **Environment Variables**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   EMAIL_RECIPIENTS=recipient1@example.com,recipient2@example.com
   ```

### Send Report

```bash
# After running tests
node scripts/sendEmailReport.js
```

### Automate in CI/CD

Add to your pipeline after test execution:

```yaml
# GitHub Actions
- name: Send Email Report
  if: always()
  run: node scripts/sendEmailReport.js
  env:
    SMTP_HOST: ${{ secrets.SMTP_HOST }}
    SMTP_USER: ${{ secrets.SMTP_USER }}
    SMTP_PASS: ${{ secrets.SMTP_PASS }}
    EMAIL_RECIPIENTS: ${{ secrets.EMAIL_RECIPIENTS }}
```

### Email Content

- Test summary (passed/failed/skipped)
- Pass percentage
- Execution duration
- Failed test screenshots (embedded)
- HTML report attachment

---

## 🎯 Best Practices

### Test Organization

1. **Group by feature**: `cypress/e2e/ui/login.cy.js`
2. **Use tags**: `{ tags: ['@smoke', '@login'] }`
3. **Keep tests independent**: Each test should run in isolation

### Locator Strategy

1. **Priority order**:
   - `data-testid` attributes (most stable)
   - `data-cy` attributes
   - Semantic selectors (`button[type="submit"]`)
   - CSS classes (less stable)
   - XPath (last resort)

2. **Avoid**:
   - Dynamic IDs
   - Positional selectors (`:nth-child`)
   - Complex XPath expressions

### Error Handling

```javascript
// Use try-catch for non-critical operations
cy.get('body').then($body => {
  if ($body.find('#optional-element').length > 0) {
    cy.get('#optional-element').click();
  }
});

// Use custom error handler
import { safeClick, safeType } from '../support/utils/errorHandler';
safeClick('#button');
```

### Performance

1. **Use API for setup**: Login via API instead of UI
2. **Use cy.session**: Cache login state
3. **Minimize waits**: Use assertions instead of `cy.wait()`
4. **Run in parallel**: Use Cypress Dashboard or CI parallelization

---

## 🔧 Troubleshooting

### Common Issues

#### Cypress Not Found

```bash
npm install cypress --save-dev
npx cypress verify
```

#### Browser Not Launching

```bash
# Clear Cypress cache
npx cypress cache clear
npx cypress install
```

#### Tests Timing Out

```javascript
// Increase timeout in cypress.config.js
{
  defaultCommandTimeout: 15000,
  pageLoadTimeout: 60000
}
```

#### YAML Locator Not Found

```javascript
// Verify file path
cy.task('readYamlFile', 'cypress/locators/login.yaml');
```

#### Session Not Persisting

```javascript
// Ensure cacheAcrossSpecs is true
cy.session('name', () => {}, {
  cacheAcrossSpecs: true
});
```

### Debug Mode

```bash
# Run with debug logs
DEBUG=cypress:* npx cypress run

# Open DevTools in headed mode
npx cypress open --config watchForFileChanges=false
```

### Getting Help

1. Check [Cypress Documentation](https://docs.cypress.io)
2. Search [Cypress GitHub Issues](https://github.com/cypress-io/cypress/issues)
3. Ask on [Cypress Discord](https://discord.gg/cypress)

---

## 📝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit Pull Request

---

## 📄 Version History

- **1.0.0** - Initial release
  - Cypress 13 support
  - YAML locators
  - Page Object Model
  - API testing
  - Allure & Mochawesome reports
  - CI/CD integration (GitHub, Jenkins, Azure, AWS)
  - Email notifications

---

## 🙏 Acknowledgments

- [Cypress](https://www.cypress.io/) - Testing framework
- [Allure](https://docs.qameta.io/allure/) - Reporting
- [Mochawesome](https://github.com/adamgruber/mochawesome) - Reporting

---

**Happy Testing! 🚀**
