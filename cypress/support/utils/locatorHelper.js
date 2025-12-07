/**
 * Locator Helper - Utility for managing YAML-based locators
 * 
 * This module provides functions to load and use locators from YAML files.
 * Supports CSS selectors, XPath, and text-based selectors.
 */

// Cache for loaded locators to avoid repeated file reads
const locatorCache = {};

/**
 * Load locators from a YAML file
 * @param {string} pageName - Name of the page (matches YAML filename without extension)
 * @returns {Promise<Object>} - Locators object
 */
function loadLocators(pageName) {
  const filePath = `cypress/locators/${pageName}.yaml`;
  
  // Return cached locators if available
  if (locatorCache[pageName]) {
    return cy.wrap(locatorCache[pageName]);
  }
  
  return cy.task('readYamlFile', filePath).then((locators) => {
    locatorCache[pageName] = locators;
    return locators;
  });
}

/**
 * Get a specific locator from a page
 * @param {string} pageName - Name of the page
 * @param {string} elementKey - Key of the element in the YAML file
 * @returns {Promise<string>} - Selector string
 */
function getLocator(pageName, elementKey) {
  return loadLocators(pageName).then((locators) => {
    const pageLocators = locators[`${pageName}Page`] || locators[pageName] || locators;
    const selector = pageLocators[elementKey];
    
    if (!selector) {
      throw new Error(`Locator not found: ${pageName}.${elementKey}`);
    }
    
    return selector;
  });
}

/**
 * Get element using locator from YAML
 * Supports CSS, XPath, and text-based selectors
 * @param {string} pageName - Name of the page
 * @param {string} elementKey - Key of the element
 * @returns {Cypress.Chainable} - Cypress element
 */
function getElement(pageName, elementKey) {
  return getLocator(pageName, elementKey).then((selector) => {
    return resolveSelector(selector);
  });
}

/**
 * Resolve selector based on its type
 * @param {string} selector - Selector string
 * @returns {Cypress.Chainable} - Cypress element
 */
function resolveSelector(selector) {
  if (selector.startsWith('xpath=')) {
    // XPath selector
    const xpath = selector.replace('xpath=', '');
    return cy.xpath(xpath);
  } else if (selector.startsWith('text=')) {
    // Text-based selector
    const text = selector.replace('text=', '');
    return cy.contains(text);
  } else {
    // CSS selector (default)
    return cy.get(selector);
  }
}

/**
 * Wait for element to be visible
 * @param {string} pageName - Name of the page
 * @param {string} elementKey - Key of the element
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Cypress.Chainable} - Cypress element
 */
function waitForElement(pageName, elementKey, timeout = 10000) {
  return getLocator(pageName, elementKey).then((selector) => {
    if (selector.startsWith('xpath=')) {
      const xpath = selector.replace('xpath=', '');
      return cy.xpath(xpath, { timeout }).should('be.visible');
    } else if (selector.startsWith('text=')) {
      const text = selector.replace('text=', '');
      return cy.contains(text, { timeout }).should('be.visible');
    } else {
      return cy.get(selector, { timeout }).should('be.visible');
    }
  });
}

/**
 * Check if element exists
 * @param {string} pageName - Name of the page
 * @param {string} elementKey - Key of the element
 * @returns {Cypress.Chainable<boolean>} - True if element exists
 */
function elementExists(pageName, elementKey) {
  return getLocator(pageName, elementKey).then((selector) => {
    return cy.get('body').then(($body) => {
      if (selector.startsWith('xpath=') || selector.startsWith('text=')) {
        // For xpath and text selectors, use a different approach
        return cy.document().then((doc) => {
          if (selector.startsWith('xpath=')) {
            const xpath = selector.replace('xpath=', '');
            const result = doc.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            return result.singleNodeValue !== null;
          } else {
            const text = selector.replace('text=', '');
            return $body.text().includes(text);
          }
        });
      } else {
        return $body.find(selector).length > 0;
      }
    });
  });
}

/**
 * Clear locator cache
 * Useful when locators might have changed during test execution
 */
function clearLocatorCache() {
  Object.keys(locatorCache).forEach(key => delete locatorCache[key]);
}

/**
 * Get all locators for a page
 * @param {string} pageName - Name of the page
 * @returns {Promise<Object>} - All locators for the page
 */
function getAllLocators(pageName) {
  return loadLocators(pageName);
}

module.exports = {
  loadLocators,
  getLocator,
  getElement,
  resolveSelector,
  waitForElement,
  elementExists,
  clearLocatorCache,
  getAllLocators
};
