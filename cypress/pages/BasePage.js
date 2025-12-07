/**
 * Base Page Object
 * 
 * Contains common methods and properties shared across all page objects.
 * All page objects should extend this class.
 */

import { getElement, getLocator, waitForElement } from '../support/utils/locatorHelper';
import { logStep } from '../support/utils/errorHandler';

class BasePage {
  constructor() {
    this.pageName = 'common';
    this.timeout = 10000;
  }

  /**
   * Visit the page URL
   * @param {string} path - URL path to visit
   */
  visit(path = '/') {
    logStep(`Visiting: ${path}`);
    cy.visit(path);
    return this;
  }

  /**
   * Get element using YAML locator
   * @param {string} elementKey - Key from YAML locator file
   */
  getElement(elementKey) {
    return getElement(this.pageName, elementKey);
  }

  /**
   * Get locator string from YAML
   * @param {string} elementKey - Key from YAML locator file
   */
  getLocator(elementKey) {
    return getLocator(this.pageName, elementKey);
  }

  /**
   * Wait for element to be visible
   * @param {string} elementKey - Key from YAML locator file
   * @param {number} timeout - Timeout in milliseconds
   */
  waitForElement(elementKey, timeout = this.timeout) {
    return waitForElement(this.pageName, elementKey, timeout);
  }

  /**
   * Click on element
   * @param {string} elementKey - Key from YAML locator file
   */
  click(elementKey) {
    logStep(`Clicking: ${elementKey}`);
    return this.getElement(elementKey).click();
  }

  /**
   * Type text into element
   * @param {string} elementKey - Key from YAML locator file
   * @param {string} text - Text to type
   */
  type(elementKey, text) {
    logStep(`Typing into: ${elementKey}`);
    return this.getElement(elementKey).clear().type(text);
  }

  /**
   * Get text from element
   * @param {string} elementKey - Key from YAML locator file
   */
  getText(elementKey) {
    return this.getElement(elementKey).invoke('text');
  }

  /**
   * Check if element is visible
   * @param {string} elementKey - Key from YAML locator file
   */
  isVisible(elementKey) {
    return this.getElement(elementKey).should('be.visible');
  }

  /**
   * Check if element exists
   * @param {string} elementKey - Key from YAML locator file
   */
  exists(elementKey) {
    return this.getLocator(elementKey).then((selector) => {
      return cy.get('body').then(($body) => {
        return $body.find(selector).length > 0;
      });
    });
  }

  /**
   * Wait for page to load
   */
  waitForPageLoad() {
    cy.document().its('readyState').should('eq', 'complete');
    return this;
  }

  /**
   * Wait for loading spinner to disappear
   */
  waitForLoading() {
    cy.waitForLoading();
    return this;
  }

  /**
   * Take screenshot
   * @param {string} name - Screenshot name
   */
  takeScreenshot(name) {
    cy.screenshot(name);
    return this;
  }

  /**
   * Scroll to element
   * @param {string} elementKey - Key from YAML locator file
   */
  scrollTo(elementKey) {
    return this.getElement(elementKey).scrollIntoView();
  }

  /**
   * Get current URL
   */
  getCurrentUrl() {
    return cy.url();
  }

  /**
   * Get page title
   */
  getPageTitle() {
    return cy.title();
  }

  /**
   * Verify URL contains path
   * @param {string} path - Expected path
   */
  verifyUrl(path) {
    cy.url().should('include', path);
    return this;
  }

  /**
   * Verify page title
   * @param {string} title - Expected title
   */
  verifyTitle(title) {
    cy.title().should('include', title);
    return this;
  }

  /**
   * Select dropdown option
   * @param {string} elementKey - Key from YAML locator file
   * @param {string} value - Value to select
   */
  select(elementKey, value) {
    logStep(`Selecting: ${value} from ${elementKey}`);
    return this.getElement(elementKey).select(value);
  }

  /**
   * Check checkbox
   * @param {string} elementKey - Key from YAML locator file
   */
  check(elementKey) {
    return this.getElement(elementKey).check();
  }

  /**
   * Uncheck checkbox
   * @param {string} elementKey - Key from YAML locator file
   */
  uncheck(elementKey) {
    return this.getElement(elementKey).uncheck();
  }

  /**
   * Clear input field
   * @param {string} elementKey - Key from YAML locator file
   */
  clear(elementKey) {
    return this.getElement(elementKey).clear();
  }

  /**
   * Get attribute value
   * @param {string} elementKey - Key from YAML locator file
   * @param {string} attribute - Attribute name
   */
  getAttribute(elementKey, attribute) {
    return this.getElement(elementKey).invoke('attr', attribute);
  }

  /**
   * Verify element has text
   * @param {string} elementKey - Key from YAML locator file
   * @param {string} text - Expected text
   */
  verifyText(elementKey, text) {
    return this.getElement(elementKey).should('contain.text', text);
  }

  /**
   * Verify element has exact text
   * @param {string} elementKey - Key from YAML locator file
   * @param {string} text - Expected exact text
   */
  verifyExactText(elementKey, text) {
    return this.getElement(elementKey).should('have.text', text);
  }

  /**
   * Verify element has value
   * @param {string} elementKey - Key from YAML locator file
   * @param {string} value - Expected value
   */
  verifyValue(elementKey, value) {
    return this.getElement(elementKey).should('have.value', value);
  }

  /**
   * Verify element is enabled
   * @param {string} elementKey - Key from YAML locator file
   */
  verifyEnabled(elementKey) {
    return this.getElement(elementKey).should('not.be.disabled');
  }

  /**
   * Verify element is disabled
   * @param {string} elementKey - Key from YAML locator file
   */
  verifyDisabled(elementKey) {
    return this.getElement(elementKey).should('be.disabled');
  }
}

export default BasePage;
