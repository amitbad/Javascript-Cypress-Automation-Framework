/**
 * Cypress Custom Commands
 * 
 * Define reusable commands that can be used across all tests.
 */

import { getElement, getLocator, waitForElement } from './utils/locatorHelper';
import { apiRequest, apiRequestWithToken, validateStatus } from './utils/apiHelper';
import { safeClick, safeType, logStep } from './utils/errorHandler';

// ============================================
// YAML Locator Commands
// ============================================

/**
 * Get element using YAML locator
 * @example cy.getByLocator('login', 'usernameInput')
 */
Cypress.Commands.add('getByLocator', (pageName, elementKey) => {
  return getElement(pageName, elementKey);
});

/**
 * Wait for element using YAML locator
 * @example cy.waitForLocator('login', 'loginButton', 15000)
 */
Cypress.Commands.add('waitForLocator', (pageName, elementKey, timeout = 10000) => {
  return waitForElement(pageName, elementKey, timeout);
});

/**
 * Click element using YAML locator
 * @example cy.clickByLocator('login', 'loginButton')
 */
Cypress.Commands.add('clickByLocator', (pageName, elementKey, options = {}) => {
  return getElement(pageName, elementKey).click(options);
});

/**
 * Type into element using YAML locator
 * @example cy.typeByLocator('login', 'usernameInput', 'testuser')
 */
Cypress.Commands.add('typeByLocator', (pageName, elementKey, text, options = {}) => {
  return getElement(pageName, elementKey).clear().type(text, options);
});

// ============================================
// Authentication Commands
// ============================================

/**
 * Login via UI
 * @example cy.login('username', 'password')
 */
Cypress.Commands.add('login', (username, password) => {
  logStep('Logging in via UI');
  
  const user = username || Cypress.env('username');
  const pass = password || Cypress.env('password');
  
  cy.visit('/login');
  cy.getByLocator('login', 'usernameInput').clear().type(user);
  cy.getByLocator('login', 'passwordInput').clear().type(pass, { log: false });
  cy.getByLocator('login', 'loginButton').click();
  
  // Wait for login to complete
  cy.url().should('not.include', '/login');
  logStep('Login successful');
});

/**
 * Login via API (faster)
 * @example cy.loginViaApi('username', 'password')
 */
Cypress.Commands.add('loginViaApi', (username, password) => {
  logStep('Logging in via API');
  
  const user = username || Cypress.env('username');
  const pass = password || Cypress.env('password');
  const apiBaseUrl = Cypress.env('apiBaseUrl') || '';
  
  return cy.request({
    method: 'POST',
    url: `${apiBaseUrl}/api/auth/login`,
    body: {
      username: user,
      password: pass
    },
    failOnStatusCode: false
  }).then((response) => {
    if (response.status === 200) {
      // Store token
      const token = response.body.token || response.body.accessToken;
      if (token) {
        Cypress.env('authToken', token);
        // Set cookie or localStorage based on your app
        cy.setCookie('auth_token', token);
      }
      logStep('API Login successful');
    } else {
      throw new Error(`Login failed with status: ${response.status}`);
    }
    return response;
  });
});

/**
 * Logout
 * @example cy.logout()
 */
Cypress.Commands.add('logout', () => {
  logStep('Logging out');
  
  cy.getByLocator('home', 'userMenu').click();
  cy.getByLocator('home', 'logoutButton').click();
  
  // Verify logout
  cy.url().should('include', '/login');
  logStep('Logout successful');
});

// ============================================
// API Testing Commands
// ============================================

/**
 * Make API request
 * @example cy.apiRequest({ method: 'GET', url: '/api/users' })
 */
Cypress.Commands.add('apiRequest', (options) => {
  return apiRequest(options);
});

/**
 * Make authenticated API request
 * @example cy.apiRequestWithToken({ method: 'GET', url: '/api/users' })
 */
Cypress.Commands.add('apiRequestWithToken', (options) => {
  const token = Cypress.env('authToken');
  return apiRequestWithToken(options, token);
});

/**
 * Validate API response status
 * @example cy.validateApiStatus(response, 200)
 */
Cypress.Commands.add('validateApiStatus', (response, expectedStatus) => {
  validateStatus(response, expectedStatus);
});

// ============================================
// UI Utility Commands
// ============================================

/**
 * Safe click with retry
 * @example cy.safeClick('#button')
 */
Cypress.Commands.add('safeClick', (selector, options = {}) => {
  return safeClick(selector, options);
});

/**
 * Safe type with clear
 * @example cy.safeType('#input', 'text')
 */
Cypress.Commands.add('safeType', (selector, text, options = {}) => {
  return safeType(selector, text, options);
});

/**
 * Wait for loading to complete
 * @example cy.waitForLoading()
 */
Cypress.Commands.add('waitForLoading', (timeout = 30000) => {
  // Wait for common loading indicators to disappear
  cy.get('body').then(($body) => {
    if ($body.find('[data-testid="loading-spinner"]').length > 0) {
      cy.get('[data-testid="loading-spinner"]', { timeout }).should('not.exist');
    }
    if ($body.find('.loading').length > 0) {
      cy.get('.loading', { timeout }).should('not.exist');
    }
  });
});

/**
 * Scroll element into view
 * @example cy.scrollToElement('#element')
 */
Cypress.Commands.add('scrollToElement', (selector) => {
  cy.get(selector).scrollIntoView({ duration: 500 });
});

/**
 * Check if element exists without failing
 * @example cy.elementExists('#element').then(exists => {...})
 */
Cypress.Commands.add('elementExists', (selector) => {
  return cy.get('body').then(($body) => {
    return $body.find(selector).length > 0;
  });
});

/**
 * Wait for network idle
 * @example cy.waitForNetworkIdle()
 */
Cypress.Commands.add('waitForNetworkIdle', (timeout = 5000) => {
  cy.intercept('**/*').as('networkRequests');
  cy.wait(timeout);
});

// ============================================
// Screenshot Commands
// ============================================

/**
 * Take full page screenshot
 * @example cy.takeFullPageScreenshot('homepage')
 */
Cypress.Commands.add('takeFullPageScreenshot', (name) => {
  cy.screenshot(name, { capture: 'fullPage' });
});

/**
 * Take viewport screenshot
 * @example cy.takeViewportScreenshot('modal')
 */
Cypress.Commands.add('takeViewportScreenshot', (name) => {
  cy.screenshot(name, { capture: 'viewport' });
});

/**
 * Take element screenshot
 * @example cy.takeElementScreenshot('#element', 'button')
 */
Cypress.Commands.add('takeElementScreenshot', (selector, name) => {
  cy.get(selector).screenshot(name);
});

// ============================================
// Form Commands
// ============================================

/**
 * Fill form from object
 * @example cy.fillForm({ '#name': 'John', '#email': 'john@test.com' })
 */
Cypress.Commands.add('fillForm', (formData) => {
  Object.entries(formData).forEach(([selector, value]) => {
    cy.get(selector).clear().type(value);
  });
});

/**
 * Select dropdown option by text
 * @example cy.selectByText('#dropdown', 'Option 1')
 */
Cypress.Commands.add('selectByText', (selector, text) => {
  cy.get(selector).select(text);
});

/**
 * Check checkbox if not already checked
 * @example cy.checkIfUnchecked('#checkbox')
 */
Cypress.Commands.add('checkIfUnchecked', (selector) => {
  cy.get(selector).then(($checkbox) => {
    if (!$checkbox.is(':checked')) {
      cy.wrap($checkbox).check();
    }
  });
});

// ============================================
// Drag and Drop Commands
// ============================================

/**
 * Drag and drop element
 * @example cy.dragAndDrop('#source', '#target')
 */
Cypress.Commands.add('dragAndDrop', (sourceSelector, targetSelector) => {
  cy.get(sourceSelector).drag(targetSelector);
});

// ============================================
// File Upload Commands
// ============================================

/**
 * Upload file
 * @example cy.uploadFile('#file-input', 'test.pdf')
 */
Cypress.Commands.add('uploadFile', (selector, fileName) => {
  cy.get(selector).selectFile(`cypress/fixtures/${fileName}`);
});

// ============================================
// Assertion Commands
// ============================================

/**
 * Assert element has text
 * @example cy.assertText('#element', 'Expected text')
 */
Cypress.Commands.add('assertText', (selector, expectedText) => {
  cy.get(selector).should('contain.text', expectedText);
});

/**
 * Assert element is visible
 * @example cy.assertVisible('#element')
 */
Cypress.Commands.add('assertVisible', (selector) => {
  cy.get(selector).should('be.visible');
});

/**
 * Assert URL contains
 * @example cy.assertUrlContains('/dashboard')
 */
Cypress.Commands.add('assertUrlContains', (path) => {
  cy.url().should('include', path);
});

// ============================================
// Browser Session Commands
// ============================================

/**
 * Attach to existing browser session (for debugging)
 * Note: This requires running Cypress with --browser chrome --headed
 * and using cy.session() for session management
 */
Cypress.Commands.add('preserveSession', () => {
  // Preserve all cookies
  cy.getCookies().then((cookies) => {
    cookies.forEach((cookie) => {
      Cypress.Cookies.preserveOnce(cookie.name);
    });
  });
});
