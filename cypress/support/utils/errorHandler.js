/**
 * Error Handler - Centralized error handling utilities
 * 
 * Provides consistent error handling, logging, and recovery mechanisms
 * for test automation.
 */

/**
 * Error types enumeration
 */
const ErrorTypes = {
  ELEMENT_NOT_FOUND: 'ELEMENT_NOT_FOUND',
  TIMEOUT: 'TIMEOUT',
  API_ERROR: 'API_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  ASSERTION_ERROR: 'ASSERTION_ERROR',
  UNKNOWN: 'UNKNOWN'
};

/**
 * Custom test error class
 */
class TestError extends Error {
  constructor(message, type = ErrorTypes.UNKNOWN, details = {}) {
    super(message);
    this.name = 'TestError';
    this.type = type;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Handle and log errors with context
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 * @param {boolean} shouldThrow - Whether to re-throw the error
 */
function handleError(error, context = '', shouldThrow = true) {
  const errorInfo = {
    message: error.message,
    type: error.type || ErrorTypes.UNKNOWN,
    context,
    stack: error.stack,
    timestamp: new Date().toISOString()
  };

  // Log error details
  cy.task('log', `\n========== ERROR ==========`);
  cy.task('log', `Context: ${context}`);
  cy.task('log', `Type: ${errorInfo.type}`);
  cy.task('log', `Message: ${errorInfo.message}`);
  cy.task('log', `Timestamp: ${errorInfo.timestamp}`);
  cy.task('log', `===========================\n`);

  // Take screenshot on error
  cy.screenshot(`error-${context}-${Date.now()}`, { capture: 'fullPage' });

  if (shouldThrow) {
    throw error;
  }
}

/**
 * Wrap action with error handling
 * @param {Function} action - Action to execute
 * @param {string} context - Context description
 * @param {Object} options - Options for error handling
 * @returns {Cypress.Chainable} - Result of action
 */
function withErrorHandling(action, context, options = {}) {
  const { shouldThrow = true, retries = 0, retryDelay = 1000 } = options;
  
  let attempts = 0;
  
  const executeAction = () => {
    attempts++;
    try {
      return action();
    } catch (error) {
      if (attempts <= retries) {
        cy.wait(retryDelay);
        return executeAction();
      }
      handleError(error, context, shouldThrow);
    }
  };
  
  return executeAction();
}

/**
 * Safe click with error handling
 * @param {string} selector - Element selector
 * @param {Object} options - Click options
 */
function safeClick(selector, options = {}) {
  const { timeout = 10000, force = false } = options;
  
  return cy.get('body').then(($body) => {
    if ($body.find(selector).length > 0) {
      return cy.get(selector, { timeout }).click({ force });
    } else {
      throw new TestError(
        `Element not found: ${selector}`,
        ErrorTypes.ELEMENT_NOT_FOUND,
        { selector }
      );
    }
  });
}

/**
 * Safe type with error handling
 * @param {string} selector - Element selector
 * @param {string} text - Text to type
 * @param {Object} options - Type options
 */
function safeType(selector, text, options = {}) {
  const { timeout = 10000, clear = true } = options;
  
  return cy.get('body').then(($body) => {
    if ($body.find(selector).length > 0) {
      const element = cy.get(selector, { timeout });
      if (clear) {
        element.clear();
      }
      return element.type(text);
    } else {
      throw new TestError(
        `Element not found: ${selector}`,
        ErrorTypes.ELEMENT_NOT_FOUND,
        { selector }
      );
    }
  });
}

/**
 * Wait for element with error handling
 * @param {string} selector - Element selector
 * @param {Object} options - Wait options
 */
function safeWaitFor(selector, options = {}) {
  const { timeout = 10000, state = 'visible' } = options;
  
  return cy.get(selector, { timeout })
    .should(`be.${state}`)
    .then(($el) => {
      if (!$el || $el.length === 0) {
        throw new TestError(
          `Element not ${state}: ${selector}`,
          ErrorTypes.TIMEOUT,
          { selector, state }
        );
      }
      return $el;
    });
}

/**
 * Validate API response with error handling
 * @param {Object} response - API response
 * @param {Object} expectations - Expected values
 */
function validateApiResponse(response, expectations) {
  const errors = [];
  
  if (expectations.status && response.status !== expectations.status) {
    errors.push(`Expected status ${expectations.status}, got ${response.status}`);
  }
  
  if (expectations.properties) {
    expectations.properties.forEach(prop => {
      if (!response.body.hasOwnProperty(prop)) {
        errors.push(`Missing property: ${prop}`);
      }
    });
  }
  
  if (expectations.values) {
    Object.entries(expectations.values).forEach(([key, value]) => {
      if (response.body[key] !== value) {
        errors.push(`Expected ${key} to be ${value}, got ${response.body[key]}`);
      }
    });
  }
  
  if (errors.length > 0) {
    throw new TestError(
      `API validation failed: ${errors.join('; ')}`,
      ErrorTypes.API_ERROR,
      { response: response.body, errors }
    );
  }
}

/**
 * Retry mechanism for flaky operations
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} delay - Delay between retries
 * @returns {Cypress.Chainable} - Result
 */
function retry(fn, maxRetries = 3, delay = 1000) {
  let lastError;
  
  const attempt = (retriesLeft) => {
    return fn().catch((error) => {
      lastError = error;
      if (retriesLeft > 0) {
        cy.wait(delay);
        return attempt(retriesLeft - 1);
      }
      throw lastError;
    });
  };
  
  return attempt(maxRetries);
}

/**
 * Assert with custom error message
 * @param {boolean} condition - Condition to assert
 * @param {string} message - Error message if assertion fails
 */
function assertWithMessage(condition, message) {
  if (!condition) {
    throw new TestError(message, ErrorTypes.ASSERTION_ERROR);
  }
}

/**
 * Log test step for better debugging
 * @param {string} stepDescription - Description of the step
 */
function logStep(stepDescription) {
  cy.task('log', `\n[STEP] ${stepDescription}`);
  cy.log(`**${stepDescription}**`);
}

module.exports = {
  ErrorTypes,
  TestError,
  handleError,
  withErrorHandling,
  safeClick,
  safeType,
  safeWaitFor,
  validateApiResponse,
  retry,
  assertWithMessage,
  logStep
};
