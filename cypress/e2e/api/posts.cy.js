/**
 * Posts API Tests
 * 
 * Test suite for Posts REST API endpoints.
 * Demonstrates CRUD operations and API testing patterns.
 */

describe('Posts API Tests', { tags: ['@api', '@posts'] }, () => {
  
  const apiBaseUrl = Cypress.env('apiBaseUrl') || 'https://jsonplaceholder.typicode.com';

  describe('GET /posts', () => {
    it('should get all posts', { tags: '@smoke' }, () => {
      cy.apiRequest({
        method: 'GET',
        url: `${apiBaseUrl}/posts`
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);
        
        // Validate first post structure
        const firstPost = response.body[0];
        expect(firstPost).to.have.all.keys('userId', 'id', 'title', 'body');
      });
    });

    it('should get post by ID', { tags: '@regression' }, () => {
      cy.apiRequest({
        method: 'GET',
        url: `${apiBaseUrl}/posts/1`
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id', 1);
        expect(response.body).to.have.property('userId');
        expect(response.body).to.have.property('title');
        expect(response.body).to.have.property('body');
      });
    });

    it('should filter posts by userId', { tags: '@regression' }, () => {
      cy.apiRequest({
        method: 'GET',
        url: `${apiBaseUrl}/posts`,
        qs: { userId: 1 }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        response.body.forEach(post => {
          expect(post.userId).to.eq(1);
        });
      });
    });

    it('should get comments for a post', { tags: '@regression' }, () => {
      cy.apiRequest({
        method: 'GET',
        url: `${apiBaseUrl}/posts/1/comments`
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        response.body.forEach(comment => {
          expect(comment.postId).to.eq(1);
        });
      });
    });
  });

  describe('POST /posts', () => {
    it('should create a new post', { tags: '@smoke' }, () => {
      const newPost = {
        title: 'Test Post Title',
        body: 'This is the test post body content.',
        userId: 1
      };

      cy.apiRequest({
        method: 'POST',
        url: `${apiBaseUrl}/posts`,
        body: newPost
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 201]);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('title', newPost.title);
        expect(response.body).to.have.property('body', newPost.body);
        expect(response.body).to.have.property('userId', newPost.userId);
      });
    });

    it('should create post with minimum required fields', { tags: '@regression' }, () => {
      const minimalPost = {
        title: 'Minimal Post',
        body: 'Minimal body',
        userId: 1
      };

      cy.apiRequest({
        method: 'POST',
        url: `${apiBaseUrl}/posts`,
        body: minimalPost
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 201]);
        expect(response.body).to.have.property('id');
      });
    });
  });

  describe('PUT /posts', () => {
    it('should update entire post', { tags: '@regression' }, () => {
      const updatedPost = {
        id: 1,
        title: 'Updated Post Title',
        body: 'Updated post body content.',
        userId: 1
      };

      cy.apiRequest({
        method: 'PUT',
        url: `${apiBaseUrl}/posts/1`,
        body: updatedPost
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('title', updatedPost.title);
        expect(response.body).to.have.property('body', updatedPost.body);
      });
    });
  });

  describe('PATCH /posts', () => {
    it('should partially update post', { tags: '@regression' }, () => {
      const partialUpdate = {
        title: 'Partially Updated Title'
      };

      cy.apiRequest({
        method: 'PATCH',
        url: `${apiBaseUrl}/posts/1`,
        body: partialUpdate
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('title', partialUpdate.title);
        // Other fields should remain unchanged
        expect(response.body).to.have.property('body');
        expect(response.body).to.have.property('userId');
      });
    });
  });

  describe('DELETE /posts', () => {
    it('should delete post', { tags: '@regression' }, () => {
      cy.apiRequest({
        method: 'DELETE',
        url: `${apiBaseUrl}/posts/1`
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 204]);
      });
    });
  });

  describe('Pagination', () => {
    it('should support pagination with _start and _limit', { tags: '@regression' }, () => {
      cy.apiRequest({
        method: 'GET',
        url: `${apiBaseUrl}/posts`,
        qs: { _start: 0, _limit: 10 }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.length.at.most(10);
      });
    });

    it('should return correct page of results', { tags: '@regression' }, () => {
      cy.apiRequest({
        method: 'GET',
        url: `${apiBaseUrl}/posts`,
        qs: { _start: 10, _limit: 5 }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.length(5);
        expect(response.body[0].id).to.eq(11);
      });
    });
  });

  describe('Response Time', () => {
    it('should respond within acceptable time', { tags: '@performance' }, () => {
      cy.apiRequest({
        method: 'GET',
        url: `${apiBaseUrl}/posts`
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.duration).to.be.lessThan(5000); // 5 seconds
      });
    });
  });

  describe('Error Scenarios', () => {
    it('should return 404 for non-existent post', { tags: '@regression' }, () => {
      cy.apiRequest({
        method: 'GET',
        url: `${apiBaseUrl}/posts/99999`
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

    it('should handle invalid post ID format', { tags: '@regression' }, () => {
      cy.apiRequest({
        method: 'GET',
        url: `${apiBaseUrl}/posts/invalid`
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 404]);
      });
    });
  });
});
