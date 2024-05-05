describe('Wishlist Tests', () => {
  const sizes: Cypress.ViewportPreset[] = ['iphone-6', 'macbook-15'];

  sizes.forEach((size) => {
    const isMobile = size === 'iphone-6';

    context(`Wishlist Test on ${size}`, () => {
      beforeEach(() => {
        cy.visit('/products');
        cy.url().should('include', '/products');
        cy.get('[data-cy="products"] > div').should('have.length', 12);
        cy.get('[data-cy="products"] > div').first().click();
        cy.url().should(
          'match',
          /\/products\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
        );
      });

      it('User should be able to add or remove a product to/from the wishlist', () => {
        if (isMobile) {
          cy.dataCy('mobile-hamburger').should('be.visible').click();
          cy.dataCy('header-mobile-nav-sign-in').click();
        } else {
          cy.dataCy('header-nav-sign-in').click();
        }
        cy.url().should('include', '/auth/signin');

        cy.fixture('userProfiles').then((users) => {
          cy.dataCy('email-input').type(users.validUser.email);
          cy.dataCy('password-input').type(users.validUser.password);
          cy.dataCy('sign-in-button').click();
          cy.url().should(
            'match',
            /\/products\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
          );
        });

        cy.dataCy('wishlist-not-added-icon').should('be.visible');
        cy.dataCy('product-add-to-wishlist')
          .should('be.visible')
          .click()
          .then(() => {
            cy.dataCy('wishlist-added-icon').should('be.visible');
          });

        cy.dataCy('product-add-to-wishlist')
          .click()
          .then(() => {
            cy.dataCy('wishlist-not-added-icon').should('be.visible');
          });
      });

      it('User should not be able to add a product to the wishlist without signing in', () => {
        cy.dataCy('wishlist-not-added-icon').should('be.visible');
        cy.dataCy('product-add-to-wishlist').should('be.visible').click();
        cy.dataCy('wishlist-sign-in-modal')
          .should('be.visible')
          .should('contain', 'Sign In to Add Products to Your Wishlist');
      });
    });
  });
});
