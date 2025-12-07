/**
 * Cypress E2E Support File
 * 
 * This file runs before every test file.
 * Use it to load global configurations, custom commands, and plugins.
 */

// Import commands
import './commands';

// Import Allure plugin
import '@shelex/cypress-allure-plugin';

// Import grep plugin for filtering tests
import '@cypress/grep';

// Import custom utilities
import { logStep } from './utils/errorHandler';

// Global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // Log the error
  cy.task('log', `Uncaught exception: ${err.message}`);
  
  // Returning false prevents Cypress from failing the test
  // You can add conditions here to decide when to fail
  if (err.message.includes('ResizeObserver loop')) {
    return false;
  }
  
  // Return true to fail the test for other errors
  return true;
});

// Before each test
beforeEach(() => {
  // Clear cookies and local storage (optional - can be configured)
  // cy.clearCookies();
  // cy.clearLocalStorage();
  
  // Log test start
  const testTitle = Cypress.currentTest?.title || 'Unknown Test';
  cy.task('log', `\n========== Starting Test: ${testTitle} ==========`);
});

// After each test
afterEach(function() {
  const testTitle = Cypress.currentTest?.title || 'Unknown Test';
  const testState = this.currentTest?.state || 'unknown';
  
  cy.task('log', `========== Test ${testState.toUpperCase()}: ${testTitle} ==========\n`);
  
  // Take screenshot on failure (configured in cypress.config.js)
  if (testState === 'failed') {
    cy.task('log', `Test failed. Screenshot captured.`);
  }
});

// Global hooks for session management (login/logout once)
// This preserves the session across tests
Cypress.Commands.add('loginOnce', (username, password) => {
  cy.session(
    [username, password],
    () => {
      // Perform login
      cy.visit('/login');
      cy.get('[data-testid="username-input"]').type(username);
      cy.get('[data-testid="password-input"]').type(password);
      cy.get('[data-testid="login-button"]').click();
      
      // Wait for successful login
      cy.url().should('not.include', '/login');
    },
    {
      // Validate session is still valid
      validate() {
        // Check if session cookie exists
        cy.getCookie('session').should('exist');
      },
      // Cache session across specs
      cacheAcrossSpecs: true
    }
  );
});

// Preserve cookies between tests (for session management)
Cypress.Cookies.defaults({
  preserve: ['session', 'auth_token', 'remember_token']
});
