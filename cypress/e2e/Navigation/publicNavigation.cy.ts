describe('Public Navigation Tests', () => {
  const sizes: Cypress.ViewportPreset[] = ['iphone-6', 'macbook-15'];

  sizes.forEach((size) => {
    context(`Public Navigation Test on ${size}`, () => {
      const isMobile = size === 'iphone-6';

      beforeEach(() => {
        cy.viewport(size);
        cy.visit('/');
        cy.url().should('include', '/');
        cy.get('h1').should('contain', 'Blossom Lane');
      });

      it('should navigate to the Products page', () => {
        if (isMobile) {
          cy.dataCy('mobile-hamburger').should('be.visible').click();
          cy.dataCy('header-mobile-nav-Product', { timeout: 5000 }).click();
        } else {
          cy.dataCy('header-nav-Product', { timeout: 5000 }).click();
        }

        cy.url().should('include', '/products');
        cy.get('[data-cy="products"] > div').should('have.length', 12);
      });

      it('should navigate to the Company page', () => {
        if (isMobile) {
          cy.dataCy('mobile-hamburger').should('be.visible').click();
          cy.dataCy('header-mobile-nav-Company', { timeout: 5000 }).click();
        } else {
          cy.dataCy('header-nav-Company', { timeout: 5000 }).click();
        }

        cy.url().should('include', '/company');
        cy.get('h1').should(
          'contain',
          "Bringing Nature's Beauty to Your Doorstep"
        );
      });

      it('should navigate to the FAQ page', () => {
        if (isMobile) {
          cy.dataCy('mobile-hamburger').should('be.visible').click();
          cy.dataCy('header-mobile-nav-FAQ', { timeout: 5000 }).click();
        } else {
          cy.dataCy('header-nav-FAQ', { timeout: 5000 }).click();
        }

        cy.url().should('include', '/faq');
        cy.get('h2').should('contain', 'Frequently asked questions');
      });

      it('should navigate to the Sign-In page', () => {
        if (isMobile) {
          cy.dataCy('mobile-hamburger').should('be.visible').click();
          cy.dataCy('header-mobile-nav-sign-in', { timeout: 5000 }).click();
        } else {
          cy.dataCy('header-nav-sign-in', { timeout: 5000 }).click();
        }

        cy.url().should(
          'include',
          `/auth/signin?callbackUrl=${encodeURIComponent(
            'http://localhost:3000'
          )}`
        );
        cy.get('h2').should('contain', 'Sign in to your account');
      });

      it('should navigate to the Create Account page', () => {
        if (isMobile) {
          cy.dataCy('mobile-hamburger').should('be.visible').click();
          cy.dataCy('header-mobile-nav-sign-up', { timeout: 5000 }).click();
        } else {
          cy.dataCy('header-nav-sign-up', { timeout: 5000 }).click();
        }

        cy.url().should('include', '/auth/signup');
        cy.get('h2').should('contain', 'Create Account');
      });

      it('should navigate to the Shopping Cart page', () => {
        cy.get('[data-cy="header-nav-cart"]').click();
        cy.url().should('include', '/cart');
        cy.get('h1').should('contain', 'Shopping Cart');
      });
    });
  });
});
