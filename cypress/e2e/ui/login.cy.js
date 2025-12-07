/**
 * Login Page Tests
 * 
 * Test suite for login functionality.
 */

import LoginPage from '../../pages/LoginPage';
import HomePage from '../../pages/HomePage';

describe('Login Page Tests', { tags: ['@smoke', '@login'] }, () => {
  
  beforeEach(() => {
    // Visit login page before each test
    LoginPage.visit();
  });

  describe('UI Elements', () => {
    it('should display login page elements', { tags: '@smoke' }, () => {
      LoginPage.verifyLoginPageDisplayed();
    });

    it('should display forgot password link', () => {
      LoginPage.isVisible('forgotPasswordLink');
    });

    it('should display sign up link', () => {
      LoginPage.isVisible('signUpLink');
    });
  });

  describe('Valid Login', () => {
    it('should login successfully with valid credentials', { tags: ['@smoke', '@regression'] }, () => {
      const username = Cypress.env('username') || 'testuser@example.com';
      const password = Cypress.env('password') || 'password123';

      LoginPage.login(username, password);
      LoginPage.waitForLoginComplete();
      
      HomePage.verifyUserLoggedIn();
    });

    it('should login with remember me checked', { tags: '@regression' }, () => {
      const username = Cypress.env('username') || 'testuser@example.com';
      const password = Cypress.env('password') || 'password123';

      LoginPage.loginWithRememberMe(username, password);
      LoginPage.waitForLoginComplete();
      
      HomePage.verifyUserLoggedIn();
    });
  });

  describe('Invalid Login', () => {
    it('should show error for invalid username', { tags: '@regression' }, () => {
      LoginPage.login('invalid@example.com', 'password123');
      LoginPage.verifyErrorMessage('Invalid credentials');
    });

    it('should show error for invalid password', { tags: '@regression' }, () => {
      const username = Cypress.env('username') || 'testuser@example.com';
      LoginPage.login(username, 'wrongpassword');
      LoginPage.verifyErrorMessage('Invalid credentials');
    });

    it('should show error for empty username', { tags: '@regression' }, () => {
      LoginPage.enterPassword('password123');
      LoginPage.clickLoginButton();
      LoginPage.verifyValidationError();
    });

    it('should show error for empty password', { tags: '@regression' }, () => {
      LoginPage.enterUsername('testuser@example.com');
      LoginPage.clickLoginButton();
      LoginPage.verifyValidationError();
    });
  });

  describe('Navigation', () => {
    it('should navigate to forgot password page', { tags: '@regression' }, () => {
      LoginPage.clickForgotPassword();
      cy.url().should('include', 'forgot-password');
    });

    it('should navigate to sign up page', { tags: '@regression' }, () => {
      LoginPage.clickSignUp();
      cy.url().should('include', 'signup');
    });
  });
});
