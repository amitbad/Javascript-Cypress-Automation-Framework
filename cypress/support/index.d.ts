/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Get element using YAML locator
     * @param pageName - Name of the page (matches YAML filename)
     * @param elementKey - Key of the element in YAML
     */
    getByLocator(pageName: string, elementKey: string): Chainable<JQuery<HTMLElement>>;

    /**
     * Wait for element using YAML locator
     */
    waitForLocator(pageName: string, elementKey: string, timeout?: number): Chainable<JQuery<HTMLElement>>;

    /**
     * Click element using YAML locator
     */
    clickByLocator(pageName: string, elementKey: string, options?: Partial<ClickOptions>): Chainable<JQuery<HTMLElement>>;

    /**
     * Type into element using YAML locator
     */
    typeByLocator(pageName: string, elementKey: string, text: string, options?: Partial<TypeOptions>): Chainable<JQuery<HTMLElement>>;

    /**
     * Login via UI
     */
    login(username?: string, password?: string): Chainable<void>;

    /**
     * Login via API
     */
    loginViaApi(username?: string, password?: string): Chainable<Cypress.Response<any>>;

    /**
     * Login once using session
     */
    loginOnce(username: string, password: string): Chainable<void>;

    /**
     * Logout
     */
    logout(): Chainable<void>;

    /**
     * Make API request
     */
    apiRequest(options: Partial<Cypress.RequestOptions>): Chainable<Cypress.Response<any>>;

    /**
     * Make authenticated API request
     */
    apiRequestWithToken(options: Partial<Cypress.RequestOptions>): Chainable<Cypress.Response<any>>;

    /**
     * Validate API response status
     */
    validateApiStatus(response: Cypress.Response<any>, expectedStatus: number): Chainable<void>;

    /**
     * Safe click with error handling
     */
    safeClick(selector: string, options?: object): Chainable<JQuery<HTMLElement>>;

    /**
     * Safe type with error handling
     */
    safeType(selector: string, text: string, options?: object): Chainable<JQuery<HTMLElement>>;

    /**
     * Wait for loading to complete
     */
    waitForLoading(timeout?: number): Chainable<void>;

    /**
     * Scroll element into view
     */
    scrollToElement(selector: string): Chainable<void>;

    /**
     * Check if element exists
     */
    elementExists(selector: string): Chainable<boolean>;

    /**
     * Wait for network idle
     */
    waitForNetworkIdle(timeout?: number): Chainable<void>;

    /**
     * Take full page screenshot
     */
    takeFullPageScreenshot(name: string): Chainable<void>;

    /**
     * Take viewport screenshot
     */
    takeViewportScreenshot(name: string): Chainable<void>;

    /**
     * Take element screenshot
     */
    takeElementScreenshot(selector: string, name: string): Chainable<void>;

    /**
     * Fill form from object
     */
    fillForm(formData: Record<string, string>): Chainable<void>;

    /**
     * Select dropdown option by text
     */
    selectByText(selector: string, text: string): Chainable<JQuery<HTMLElement>>;

    /**
     * Check checkbox if unchecked
     */
    checkIfUnchecked(selector: string): Chainable<JQuery<HTMLElement>>;

    /**
     * Upload file
     */
    uploadFile(selector: string, fileName: string): Chainable<void>;

    /**
     * Assert element has text
     */
    assertText(selector: string, expectedText: string): Chainable<void>;

    /**
     * Assert element is visible
     */
    assertVisible(selector: string): Chainable<void>;

    /**
     * Assert URL contains
     */
    assertUrlContains(path: string): Chainable<void>;

    /**
     * Preserve session
     */
    preserveSession(): Chainable<void>;
  }
}
