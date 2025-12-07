/**
 * Login Page Object
 * 
 * Contains methods for interacting with the login page.
 */

import BasePage from './BasePage';
import { logStep } from '../support/utils/errorHandler';

class LoginPage extends BasePage {
  constructor() {
    super();
    this.pageName = 'login';
    this.pageUrl = '/login';
  }

  /**
   * Navigate to login page
   */
  visit() {
    logStep('Navigating to Login page');
    cy.visit(this.pageUrl);
    return this;
  }

  /**
   * Enter username
   * @param {string} username - Username to enter
   */
  enterUsername(username) {
    logStep(`Entering username: ${username}`);
    this.type('usernameInput', username);
    return this;
  }

  /**
   * Enter password
   * @param {string} password - Password to enter
   */
  enterPassword(password) {
    logStep('Entering password');
    this.getElement('passwordInput').clear().type(password, { log: false });
    return this;
  }

  /**
   * Click login button
   */
  clickLoginButton() {
    logStep('Clicking login button');
    this.click('loginButton');
    return this;
  }

  /**
   * Check remember me checkbox
   */
  checkRememberMe() {
    logStep('Checking remember me');
    this.check('rememberMeCheckbox');
    return this;
  }

  /**
   * Click forgot password link
   */
  clickForgotPassword() {
    logStep('Clicking forgot password');
    this.click('forgotPasswordLink');
    return this;
  }

  /**
   * Click sign up link
   */
  clickSignUp() {
    logStep('Clicking sign up');
    this.click('signUpLink');
    return this;
  }

  /**
   * Perform complete login
   * @param {string} username - Username
   * @param {string} password - Password
   */
  login(username, password) {
    logStep('Performing login');
    this.enterUsername(username);
    this.enterPassword(password);
    this.clickLoginButton();
    return this;
  }

  /**
   * Perform login with remember me
   * @param {string} username - Username
   * @param {string} password - Password
   */
  loginWithRememberMe(username, password) {
    logStep('Performing login with remember me');
    this.enterUsername(username);
    this.enterPassword(password);
    this.checkRememberMe();
    this.clickLoginButton();
    return this;
  }

  /**
   * Get error message text
   */
  getErrorMessage() {
    return this.getText('errorMessage');
  }

  /**
   * Verify error message is displayed
   * @param {string} expectedMessage - Expected error message
   */
  verifyErrorMessage(expectedMessage) {
    logStep('Verifying error message');
    this.verifyText('errorMessage', expectedMessage);
    return this;
  }

  /**
   * Verify login page is displayed
   */
  verifyLoginPageDisplayed() {
    logStep('Verifying login page is displayed');
    this.isVisible('usernameInput');
    this.isVisible('passwordInput');
    this.isVisible('loginButton');
    return this;
  }

  /**
   * Verify validation error is displayed
   */
  verifyValidationError() {
    this.isVisible('validationError');
    return this;
  }

  /**
   * Click Google login button
   */
  clickGoogleLogin() {
    logStep('Clicking Google login');
    this.click('googleLoginBtn');
    return this;
  }

  /**
   * Click Facebook login button
   */
  clickFacebookLogin() {
    logStep('Clicking Facebook login');
    this.click('facebookLoginBtn');
    return this;
  }

  /**
   * Wait for login to complete
   */
  waitForLoginComplete() {
    logStep('Waiting for login to complete');
    cy.url().should('not.include', '/login');
    return this;
  }

  /**
   * Verify login button is disabled
   */
  verifyLoginButtonDisabled() {
    this.verifyDisabled('loginButton');
    return this;
  }

  /**
   * Verify login button is enabled
   */
  verifyLoginButtonEnabled() {
    this.verifyEnabled('loginButton');
    return this;
  }
}

export default new LoginPage();
