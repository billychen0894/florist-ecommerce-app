describe('User Update Tests', () => {
  const sizes: Cypress.ViewportPreset[] = ['iphone-6', 'macbook-15'];

  sizes.forEach((size) => {
    const isMobile = size === 'iphone-6';

    context(`User Update on ${size} view`, () => {
      beforeEach(() => {
        cy.task('seedTestUser');
      });

      afterEach(() => {
        cy.task('clearTestUser');
      });

      it('should allow user to update personal information', () => {
        cy.visit('/auth/signin');
        cy.url().should('include', '/auth/signin');
        cy.get('h2').should('contain', 'Sign in to your account');
        cy.fixture('userProfiles').then((users) => {
          cy.dataCy('email-input').type(users.testUser.email);
          cy.dataCy('password-input').type(users.testUser.password);
          cy.dataCy('sign-in-button', { timeout: 3000 }).click();
          cy.url().should('include', '/');
        });

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
        cy.dataCy('firstName-input').should('have.value', 'test10');
        cy.dataCy('lastName-input').should('have.value', 'test10');
        cy.dataCy('phone-input').should('have.value', '');

        cy.dataCy('firstName-input').clear().type('test11');
        cy.dataCy('lastName-input').clear().type('test11');
        cy.dataCy('phone-input').type('604-727-7598');
        cy.dataCy('personal-info-save-btn', { timeout: 5000 })
          .click()
          .then(() => {
            cy.wait(5000);
            cy.reload();
          });

        cy.dataCy('firstName-input').should('have.value', 'test11');
        cy.dataCy('lastName-input').should('have.value', 'test11');
        cy.dataCy('phone-input').should('have.value', '604-727-7598');
      });

      it('should allow user to update billing and shipping information', () => {
        cy.visit('/auth/signin');
        cy.url().should('include', '/auth/signin');
        cy.get('h2').should('contain', 'Sign in to your account');
        cy.fixture('userProfiles').then((users) => {
          cy.dataCy('email-input').type(users.testUser.email);
          cy.dataCy('password-input').type(users.testUser.password);
          cy.dataCy('sign-in-button', { timeout: 3000 }).click();
          cy.url().should('include', '/');
        });

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

        cy.fixture('userProfiles').then((users) => {
          cy.dataCy('shippingAddressLine1-input')
            .clear()
            .type(users.addressInfo.address);
          cy.dataCy('shippingCity-input').clear().type(users.addressInfo.city);
          cy.dataCy('shippingArea-input').select(users.addressInfo.area);
          cy.dataCy('shippingCountry-input').select(users.addressInfo.country);
          cy.dataCy('shippingPostalCode-input')
            .clear()
            .type(users.addressInfo.postalCode);
          cy.dataCy('billingAddressLine1-input')
            .clear()
            .type(users.addressInfo.address);
          cy.dataCy('billingCity-input').clear().type(users.addressInfo.city);
          cy.dataCy('billingArea-input').select(users.addressInfo.area);
          cy.dataCy('billingCountry-input').select(users.addressInfo.country);
          cy.dataCy('billingPostalCode-input')
            .clear()
            .type(users.addressInfo.postalCode);
        });

        cy.dataCy('address-save-btn', { timeout: 5000 })
          .click()
          .then(() => {
            cy.wait(5000);
            cy.reload();
          });

        cy.dataCy('shippingAddressLine1-input').should(
          'have.value',
          'test address'
        );
        cy.dataCy('shippingCity-input').should('have.value', 'Vancouver');
        cy.dataCy('shippingArea-input').should('have.value', 'BC');
        cy.dataCy('shippingCountry-input').should('have.value', 'CA');
        cy.dataCy('shippingPostalCode-input').should('have.value', 'V5Z 1A1');

        cy.dataCy('billingAddressLine1-input').should(
          'have.value',
          'test address'
        );
        cy.dataCy('billingCity-input').should('have.value', 'Vancouver');
        cy.dataCy('billingArea-input').should('have.value', 'BC');
        cy.dataCy('billingCountry-input').should('have.value', 'CA');
        cy.dataCy('billingPostalCode-input').should('have.value', 'V5Z 1A1');
      });
    });
  });
});
