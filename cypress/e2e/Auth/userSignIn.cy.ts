describe('User Login Tests', () => {
  beforeEach(() => {
    cy.visit('/auth/signin');
    cy.url().should('include', '/auth/signin');
    cy.get('h2').should('contain', 'Sign in to your account');
  });

  it('should allow user to sign in with valid credentials', () => {
    cy.fixture('userProfiles').then((users) => {
      cy.dataCy('email-input').type(users.validUser.email);
      cy.dataCy('password-input').type(users.validUser.password);
      cy.dataCy('sign-in-button').click();
      cy.url().should('include', '/');
    });
  });

  it('should not allow user to sign in with invalid credentials', () => {
    cy.fixture('userProfiles').then((users) => {
      cy.dataCy('email-input').type(users.invalidUser.email);
      cy.dataCy('password-input').type(users.invalidUser.password);
      cy.dataCy('sign-in-button').click();
      cy.dataCy('password-error-msg').should(
        'contain',
        'Incorrect password. Please try again.'
      );
    });
  });

  it('should allow user with admin role to sign in with valid credentails', () => {
    cy.fixture('userProfiles').then((users) => {
      cy.dataCy('email-input').type(users.adminUser.email);
      cy.dataCy('password-input').type(users.adminUser.password);
      cy.dataCy('sign-in-button').click();
      cy.url().should('include', '/');
      cy.dataCy('admin-portal-link').should('be.visible');
    });
  });
});
