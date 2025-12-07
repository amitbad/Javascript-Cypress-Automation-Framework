/**
 * Home Page Object
 * 
 * Contains methods for interacting with the home page.
 */

import BasePage from './BasePage';
import { logStep } from '../support/utils/errorHandler';

class HomePage extends BasePage {
  constructor() {
    super();
    this.pageName = 'home';
    this.pageUrl = '/';
  }

  /**
   * Navigate to home page
   */
  visit() {
    logStep('Navigating to Home page');
    cy.visit(this.pageUrl);
    return this;
  }

  /**
   * Verify home page is displayed
   */
  verifyHomePageDisplayed() {
    logStep('Verifying home page is displayed');
    this.isVisible('header');
    this.isVisible('mainContent');
    return this;
  }

  /**
   * Click on logo
   */
  clickLogo() {
    logStep('Clicking logo');
    this.click('logo');
    return this;
  }

  /**
   * Search for item
   * @param {string} searchTerm - Search term
   */
  search(searchTerm) {
    logStep(`Searching for: ${searchTerm}`);
    this.type('searchInput', searchTerm);
    this.click('searchButton');
    return this;
  }

  /**
   * Open user menu
   */
  openUserMenu() {
    logStep('Opening user menu');
    this.click('userMenu');
    return this;
  }

  /**
   * Click logout button
   */
  clickLogout() {
    logStep('Clicking logout');
    this.openUserMenu();
    this.click('logoutButton');
    return this;
  }

  /**
   * Perform logout
   */
  logout() {
    logStep('Performing logout');
    this.clickLogout();
    cy.url().should('include', '/login');
    return this;
  }

  /**
   * Navigate to profile
   */
  goToProfile() {
    logStep('Navigating to profile');
    this.openUserMenu();
    this.click('profileLink');
    return this;
  }

  /**
   * Navigate to settings
   */
  goToSettings() {
    logStep('Navigating to settings');
    this.openUserMenu();
    this.click('settingsLink');
    return this;
  }

  /**
   * Get notification count
   */
  getNotificationCount() {
    return this.getText('notificationCount');
  }

  /**
   * Open notifications
   */
  openNotifications() {
    logStep('Opening notifications');
    this.click('notificationBell');
    return this;
  }

  /**
   * Verify user is logged in
   */
  verifyUserLoggedIn() {
    logStep('Verifying user is logged in');
    this.isVisible('userMenu');
    return this;
  }

  /**
   * Verify featured items are displayed
   */
  verifyFeaturedItemsDisplayed() {
    this.isVisible('featuredItems');
    return this;
  }

  /**
   * Verify hero section is displayed
   */
  verifyHeroSectionDisplayed() {
    this.isVisible('heroSection');
    return this;
  }

  /**
   * Get user avatar
   */
  getUserAvatar() {
    return this.getElement('userAvatar');
  }

  /**
   * Verify footer is displayed
   */
  verifyFooterDisplayed() {
    this.isVisible('footer');
    return this;
  }

  /**
   * Get copyright text
   */
  getCopyrightText() {
    return this.getText('copyrightText');
  }
}

export default new HomePage();
