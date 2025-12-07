/**
 * Users API Tests
 * 
 * Test suite for Users REST API endpoints.
 */

describe('Users API Tests', { tags: ['@api', '@users'] }, () => {
  
  const apiBaseUrl = Cypress.env('apiBaseUrl') || 'https://jsonplaceholder.typicode.com';
  let authToken;

  before(() => {
    // Get auth token if needed
    // This is an example - adjust based on your API
    cy.request({
      method: 'POST',
      url: `${apiBaseUrl}/auth/login`,
      body: {
        username: Cypress.env('username') || 'testuser',
        password: Cypress.env('password') || 'password123'
      },
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 200 && response.body.token) {
        authToken = response.body.token;
        Cypress.env('authToken', authToken);
      }
    });
  });

  describe('GET /users', () => {
    it('should get all users', { tags: '@smoke' }, () => {
      cy.apiRequest({
        method: 'GET',
        url: `${apiBaseUrl}/users`
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);
      });
    });

    it('should get user by ID', { tags: '@regression' }, () => {
      cy.apiRequest({
        method: 'GET',
        url: `${apiBaseUrl}/users/1`
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id', 1);
        expect(response.body).to.have.property('name');
        expect(response.body).to.have.property('email');
      });
    });

    it('should return 404 for non-existent user', { tags: '@regression' }, () => {
      cy.apiRequest({
        method: 'GET',
        url: `${apiBaseUrl}/users/99999`
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe('POST /users', () => {
    it('should create a new user', { tags: '@smoke' }, () => {
      const newUser = {
        name: 'Test User',
        username: 'testuser',
        email: 'testuser@example.com',
        phone: '1234567890'
      };

      cy.apiRequest({
        method: 'POST',
        url: `${apiBaseUrl}/users`,
        body: newUser
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 201]);
        expect(response.body).to.have.property('name', newUser.name);
        expect(response.body).to.have.property('email', newUser.email);
      });
    });

    it('should validate required fields', { tags: '@regression' }, () => {
      cy.apiRequest({
        method: 'POST',
        url: `${apiBaseUrl}/users`,
        body: {}
      }).then((response) => {
        // Adjust based on your API's validation response
        expect(response.status).to.be.oneOf([200, 201, 400, 422]);
      });
    });
  });

  describe('PUT /users', () => {
    it('should update user', { tags: '@regression' }, () => {
      const updatedUser = {
        name: 'Updated User Name',
        email: 'updated@example.com'
      };

      cy.apiRequest({
        method: 'PUT',
        url: `${apiBaseUrl}/users/1`,
        body: updatedUser
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('name', updatedUser.name);
      });
    });
  });

  describe('PATCH /users', () => {
    it('should partially update user', { tags: '@regression' }, () => {
      const partialUpdate = {
        name: 'Partially Updated Name'
      };

      cy.apiRequest({
        method: 'PATCH',
        url: `${apiBaseUrl}/users/1`,
        body: partialUpdate
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('name', partialUpdate.name);
      });
    });
  });

  describe('DELETE /users', () => {
    it('should delete user', { tags: '@regression' }, () => {
      cy.apiRequest({
        method: 'DELETE',
        url: `${apiBaseUrl}/users/1`
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 204]);
      });
    });
  });

  describe('Response Schema Validation', () => {
    it('should validate user response schema', { tags: '@regression' }, () => {
      cy.apiRequest({
        method: 'GET',
        url: `${apiBaseUrl}/users/1`
      }).then((response) => {
        expect(response.status).to.eq(200);
        
        // Validate schema
        const user = response.body;
        expect(user).to.have.property('id').that.is.a('number');
        expect(user).to.have.property('name').that.is.a('string');
        expect(user).to.have.property('email').that.is.a('string');
        expect(user).to.have.property('username').that.is.a('string');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid request body', { tags: '@regression' }, () => {
      cy.apiRequest({
        method: 'POST',
        url: `${apiBaseUrl}/users`,
        body: 'invalid json',
        headers: {
          'Content-Type': 'text/plain'
        }
      }).then((response) => {
        // API should handle gracefully
        expect(response.status).to.be.oneOf([200, 201, 400, 415, 422]);
      });
    });

    it('should handle missing authorization', { tags: '@regression' }, () => {
      // Test endpoint that requires auth (if applicable)
      cy.apiRequest({
        method: 'GET',
        url: `${apiBaseUrl}/users/me`
      }).then((response) => {
        // Adjust based on your API
        expect(response.status).to.be.oneOf([200, 401, 404]);
      });
    });
  });
});
