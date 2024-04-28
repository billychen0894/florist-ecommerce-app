const testNavigation = (viewport: Cypress.ViewportPreset) => {
  it('should navigate through public pages correctly', () => {
    cy.viewport(viewport);
    cy.visit('/');
    cy.url().should('include', '/');
    cy.get('h1').should('contain', 'Blossom Lane');

    const isMobile = viewport === 'iphone-6';
    const openMenuIfNeeded = () => {
      if (isMobile) {
        cy.get('[data-cy="mobile-hamburger"]').click();
      }
    };

    // Navigate to a page and verify expected elements
    const navigateAndVerify = (
      selector: string,
      expectedUrl: string,
      contentVerification: () => void
    ) => {
      openMenuIfNeeded();
      cy.get(selector, { timeout: 5000 }).should('be.visible').click();
      cy.url().should('include', expectedUrl);
      contentVerification(); // Execute content-specific checks
    };

    // Navigate and check the Product Page
    navigateAndVerify(
      isMobile
        ? '[data-cy="header-mobile-nav-Product"]'
        : '[data-cy="header-nav-Product"]',
      '/products',
      () => cy.get('[data-cy="products"] > div').should('have.length', 12)
    );

    // Navigate and check the Company Page
    navigateAndVerify(
      isMobile
        ? '[data-cy="header-mobile-nav-Company"]'
        : '[data-cy="header-nav-Company"]',
      '/company',
      () =>
        cy
          .get('h1')
          .should('contain', "Bringing Nature's Beauty to Your Doorstep")
    );

    // Navigate and check the FAQ Page
    navigateAndVerify(
      isMobile
        ? '[data-cy="header-mobile-nav-FAQ"]'
        : '[data-cy="header-nav-FAQ"]',
      '/faq',
      () => cy.get('h2').should('contain', 'Frequently asked questions')
    );

    // Navigate and check the Sign-In Page
    navigateAndVerify(
      isMobile
        ? '[data-cy="header-mobile-nav-sign-in"]'
        : '[data-cy="header-nav-sign-in"]',
      `/auth/signin?callbackUrl=${encodeURIComponent(
        'http://localhost:3000/faq'
      )}`,
      () => cy.get('h2').should('contain', 'Sign in to your account')
    );

    // Navigate and check the Create Account Page
    navigateAndVerify(
      isMobile
        ? '[data-cy="header-mobile-nav-sign-up"]'
        : '[data-cy="header-nav-sign-up"]',
      '/auth/signup',
      () => cy.get('h2').should('contain', 'Create Account')
    );

    // Navigate and check the Shopping Cart Page
    cy.get('[data-cy="header-nav-cart"]').click();
    cy.url().should('include', '/cart');
    cy.get('h1').should('contain', 'Shopping Cart');
  });
};

describe('Public Navigation Tests', () => {
  context('Desktop View', () => {
    testNavigation('macbook-15');
  });

  context('Mobile View', () => {
    testNavigation('iphone-6');
  });
});
