describe('User Logout Tests', () => {
  const sizes: Cypress.ViewportPreset[] = ['macbook-15', 'iphone-6'];

  sizes.forEach((size) => {
    context(`User Logout Test on ${size}`, () => {
      const isMobile = size === 'iphone-6';

      beforeEach(() => {
        cy.visit('/auth/signin');
        cy.url().should('include', '/auth/signin');
        cy.get('h2').should('contain', 'Sign in to your account');
        cy.fixture('userProfiles').then((users) => {
          cy.dataCy('email-input').type(users.validUser.email);
          cy.dataCy('password-input').type(users.validUser.password);
          cy.dataCy('sign-in-button').click();
          cy.url().should('include', '/');
          cy.dataCy('user-avatar-btn').should('be.visible');
        });
      });

      it('should allow user to logout when logged in', () => {
        if (isMobile) {
          cy.dataCy('mobile-hamburger').should('be.visible').click();
          cy.dataCy('header-mobile-nav-sign-out', { timeout: 5000 }).click();
          cy.dataCy('user-avatar-btn').should('not.exist');
        } else {
          cy.dataCy('user-avatar-btn').click();
          cy.dataCy('sign-out-btn', { timeout: 5000 }).click();
          cy.dataCy('user-avatar-btn').should('not.exist');
        }
      });
    });
  });
});
