/**
 * Home Page Tests
 * 
 * Test suite for home page functionality.
 * Uses session management to login once and reuse across tests.
 */

import LoginPage from '../../pages/LoginPage';
import HomePage from '../../pages/HomePage';

describe('Home Page Tests', { tags: ['@smoke', '@home'] }, () => {
  
  // Login once before all tests using session
  before(() => {
    const username = Cypress.env('username') || 'testuser@example.com';
    const password = Cypress.env('password') || 'password123';
    
    // Use cy.session to login once and cache the session
    cy.session('userSession', () => {
      LoginPage.visit();
      LoginPage.login(username, password);
      LoginPage.waitForLoginComplete();
    }, {
      cacheAcrossSpecs: true
    });
  });

  beforeEach(() => {
    // Restore session and visit home page
    const username = Cypress.env('username') || 'testuser@example.com';
    const password = Cypress.env('password') || 'password123';
    
    cy.session('userSession', () => {
      LoginPage.visit();
      LoginPage.login(username, password);
      LoginPage.waitForLoginComplete();
    }, {
      cacheAcrossSpecs: true
    });
    
    HomePage.visit();
  });

  describe('Page Elements', () => {
    it('should display home page elements', { tags: '@smoke' }, () => {
      HomePage.verifyHomePageDisplayed();
    });

    it('should display header', () => {
      HomePage.isVisible('header');
    });

    it('should display footer', () => {
      HomePage.verifyFooterDisplayed();
    });

    it('should display user menu when logged in', { tags: '@smoke' }, () => {
      HomePage.verifyUserLoggedIn();
    });
  });

  describe('Search Functionality', () => {
    it('should perform search', { tags: '@regression' }, () => {
      HomePage.search('test product');
      cy.url().should('include', 'search');
    });
  });

  describe('User Menu', () => {
    it('should open user menu', { tags: '@regression' }, () => {
      HomePage.openUserMenu();
      HomePage.isVisible('logoutButton');
    });

    it('should navigate to profile', { tags: '@regression' }, () => {
      HomePage.goToProfile();
      cy.url().should('include', 'profile');
    });

    it('should navigate to settings', { tags: '@regression' }, () => {
      HomePage.goToSettings();
      cy.url().should('include', 'settings');
    });
  });

  describe('Notifications', () => {
    it('should open notifications dropdown', { tags: '@regression' }, () => {
      HomePage.openNotifications();
      HomePage.isVisible('notificationDropdown');
    });
  });

  describe('Logout', () => {
    it('should logout successfully', { tags: ['@smoke', '@regression'] }, () => {
      HomePage.logout();
      cy.url().should('include', '/login');
      LoginPage.verifyLoginPageDisplayed();
    });
  });
});
