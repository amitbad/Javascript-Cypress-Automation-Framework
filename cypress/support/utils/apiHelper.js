/**
 * API Helper - Utility for REST API testing
 * 
 * Provides methods for making API requests with proper error handling,
 * authentication, and response validation.
 */

const API_TIMEOUT = 30000;

/**
 * Base API request method
 * @param {Object} options - Request options
 * @returns {Cypress.Chainable} - Cypress request response
 */
function apiRequest(options) {
  const defaultOptions = {
    timeout: API_TIMEOUT,
    failOnStatusCode: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };

  return cy.request(mergedOptions).then((response) => {
    // Log request details for debugging
    cy.task('log', `API Request: ${options.method || 'GET'} ${options.url}`);
    cy.task('log', `Response Status: ${response.status}`);
    
    return response;
  });
}

/**
 * API request with authentication token
 * @param {Object} options - Request options
 * @param {string} token - Authentication token
 * @returns {Cypress.Chainable} - Cypress request response
 */
function apiRequestWithToken(options, token) {
  const authOptions = {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  };

  return apiRequest(authOptions);
}

/**
 * GET request
 * @param {string} url - API endpoint URL
 * @param {Object} queryParams - Query parameters
 * @param {Object} headers - Additional headers
 * @returns {Cypress.Chainable} - Response
 */
function get(url, queryParams = {}, headers = {}) {
  return apiRequest({
    method: 'GET',
    url,
    qs: queryParams,
    headers
  });
}

/**
 * POST request
 * @param {string} url - API endpoint URL
 * @param {Object} body - Request body
 * @param {Object} headers - Additional headers
 * @returns {Cypress.Chainable} - Response
 */
function post(url, body = {}, headers = {}) {
  return apiRequest({
    method: 'POST',
    url,
    body,
    headers
  });
}

/**
 * PUT request
 * @param {string} url - API endpoint URL
 * @param {Object} body - Request body
 * @param {Object} headers - Additional headers
 * @returns {Cypress.Chainable} - Response
 */
function put(url, body = {}, headers = {}) {
  return apiRequest({
    method: 'PUT',
    url,
    body,
    headers
  });
}

/**
 * PATCH request
 * @param {string} url - API endpoint URL
 * @param {Object} body - Request body
 * @param {Object} headers - Additional headers
 * @returns {Cypress.Chainable} - Response
 */
function patch(url, body = {}, headers = {}) {
  return apiRequest({
    method: 'PATCH',
    url,
    body,
    headers
  });
}

/**
 * DELETE request
 * @param {string} url - API endpoint URL
 * @param {Object} headers - Additional headers
 * @returns {Cypress.Chainable} - Response
 */
function del(url, headers = {}) {
  return apiRequest({
    method: 'DELETE',
    url,
    headers
  });
}

/**
 * Validate response status code
 * @param {Object} response - API response
 * @param {number} expectedStatus - Expected status code
 */
function validateStatus(response, expectedStatus) {
  expect(response.status).to.eq(expectedStatus);
}

/**
 * Validate response contains specific properties
 * @param {Object} response - API response
 * @param {Array<string>} properties - Array of property names
 */
function validateResponseProperties(response, properties) {
  properties.forEach(prop => {
    expect(response.body).to.have.property(prop);
  });
}

/**
 * Validate response schema
 * @param {Object} response - API response
 * @param {Object} schema - Expected schema object
 */
function validateSchema(response, schema) {
  Object.keys(schema).forEach(key => {
    expect(response.body).to.have.property(key);
    expect(typeof response.body[key]).to.eq(schema[key]);
  });
}

/**
 * Get authentication token via login API
 * @param {string} loginUrl - Login endpoint URL
 * @param {Object} credentials - Login credentials
 * @returns {Cypress.Chainable<string>} - Auth token
 */
function getAuthToken(loginUrl, credentials) {
  return post(loginUrl, credentials).then((response) => {
    validateStatus(response, 200);
    const token = response.body.token || response.body.accessToken || response.body.access_token;
    
    if (!token) {
      throw new Error('No token found in login response');
    }
    
    return token;
  });
}

/**
 * Store auth token in Cypress environment
 * @param {string} token - Auth token
 */
function storeAuthToken(token) {
  Cypress.env('authToken', token);
}

/**
 * Get stored auth token
 * @returns {string} - Stored auth token
 */
function getStoredAuthToken() {
  return Cypress.env('authToken');
}

/**
 * Make authenticated request using stored token
 * @param {Object} options - Request options
 * @returns {Cypress.Chainable} - Response
 */
function authenticatedRequest(options) {
  const token = getStoredAuthToken();
  if (!token) {
    throw new Error('No auth token stored. Please login first.');
  }
  return apiRequestWithToken(options, token);
}

/**
 * Retry API request on failure
 * @param {Object} options - Request options
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} delay - Delay between retries in ms
 * @returns {Cypress.Chainable} - Response
 */
function retryRequest(options, maxRetries = 3, delay = 1000) {
  let attempts = 0;
  
  const makeRequest = () => {
    attempts++;
    return apiRequest(options).then((response) => {
      if (response.status >= 500 && attempts < maxRetries) {
        cy.wait(delay);
        return makeRequest();
      }
      return response;
    });
  };
  
  return makeRequest();
}

/**
 * Upload file via API
 * @param {string} url - Upload endpoint URL
 * @param {string} filePath - Path to file
 * @param {string} fieldName - Form field name for file
 * @returns {Cypress.Chainable} - Response
 */
function uploadFile(url, filePath, fieldName = 'file') {
  return cy.fixture(filePath, 'binary').then((fileContent) => {
    const blob = Cypress.Blob.binaryStringToBlob(fileContent);
    const formData = new FormData();
    formData.append(fieldName, blob, filePath);
    
    return cy.request({
      method: 'POST',
      url,
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  });
}

module.exports = {
  apiRequest,
  apiRequestWithToken,
  get,
  post,
  put,
  patch,
  del,
  validateStatus,
  validateResponseProperties,
  validateSchema,
  getAuthToken,
  storeAuthToken,
  getStoredAuthToken,
  authenticatedRequest,
  retryRequest,
  uploadFile
};
