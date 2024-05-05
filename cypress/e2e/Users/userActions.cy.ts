describe('User Actions Tests', () => {
  const sizes: Cypress.ViewportPreset[] = ['iphone-6', 'macbook-15'];

  sizes.forEach((size) => {
    const isMobile = size === 'iphone-6';

    context(`User Actions Test on ${size}`, () => {
      beforeEach(() => {
        cy.visit('/auth/signin');
        cy.url().should('include', '/auth/signin');
        cy.get('h2').should('contain', 'Sign in to your account');
        cy.fixture('userProfiles').then((users) => {
          cy.dataCy('email-input').type(users.validUser.email);
          cy.dataCy('password-input').type(users.validUser.password);
          cy.dataCy('sign-in-button').click();
          cy.url().should('include', '/');
        });
      });

      it('should allow user to visit profile page', () => {
        if (isMobile) {
          cy.dataCy('mobile-hamburger').should('be.visible').click();
          cy.dataCy('header-mobile-nav-Profile', { timeout: 5000 }).click();
        } else {
          cy.dataCy('user-avatar-btn').should('be.visible').click();
          cy.dataCy('Profile-link', { timeout: 5000 })
            .should('be.visible')
            .click();
        }

        cy.url().should('include', '/user/profile');
        cy.dataCy('user-subnav').should('be.visible');
        cy.dataCy('user-subnav-Profile').should(
          'have.class',
          'text-primary-500'
        );
        cy.dataCy('personal-info').should('be.visible');
        cy.dataCy('billing-and-shipping-info').should('be.visible');
      });

      it('should allow user to visit orders page', () => {
        if (isMobile) {
          cy.dataCy('mobile-hamburger').should('be.visible').click();
          cy.dataCy('header-mobile-nav-Orders', { timeout: 5000 }).click();
        } else {
          cy.dataCy('user-avatar-btn').should('be.visible').click();
          cy.dataCy('Orders-link', { timeout: 5000 })
            .should('be.visible')
            .click();
        }

        cy.url().should('include', '/user/orders');
        cy.dataCy('user-subnav').should('be.visible');
        cy.dataCy('user-subnav-Orders').should(
          'have.class',
          'text-primary-500'
        );
        cy.dataCy('orders-table').should('be.visible');
      });

      it('should allow user to visit wishlist page', () => {
        if (isMobile) {
          cy.dataCy('mobile-hamburger').should('be.visible').click();
          cy.dataCy('header-mobile-nav-Wishlist', { timeout: 5000 }).click();
        } else {
          cy.dataCy('user-avatar-btn').should('be.visible').click();
          cy.dataCy('Wishlist-link', { timeout: 5000 })
            .should('be.visible')
            .click();
        }

        cy.url().should('include', '/user/wishlist');
        cy.dataCy('user-subnav').should('be.visible');
        cy.dataCy('user-subnav-Wishlist').should(
          'have.class',
          'text-primary-500'
        );
      });

      it('should allow user to visit settings page', () => {
        if (isMobile) {
          cy.dataCy('mobile-hamburger').should('be.visible').click();
          cy.dataCy('header-mobile-nav-Settings', { timeout: 5000 }).click();
        } else {
          cy.dataCy('user-avatar-btn').should('be.visible').click();
          cy.dataCy('Settings-link', { timeout: 5000 })
            .should('be.visible')
            .click();
        }

        cy.url().should('include', '/user/settings');
        cy.dataCy('user-subnav').should('be.visible');
        cy.dataCy('user-subnav-Settings').should(
          'have.class',
          'text-primary-500'
        );
      });
    });
  });
});
