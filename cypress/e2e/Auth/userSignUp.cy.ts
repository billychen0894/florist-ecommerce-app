describe('User Sign-up Tests', () => {
  beforeEach(() => {
    cy.visit('/auth/signup');
    cy.url().should('include', '/auth/signup');
    cy.get('h2').should('contain', 'Create Account');
  });

  it('should allow user to sign up with unregistered email', () => {
    cy.fixture('userProfiles').then((users) => {
      cy.dataCy('firstName-input').type(users.unregisteredUser.firstName);
      cy.dataCy('lastName-input').type(users.unregisteredUser.lastName);
      cy.dataCy('email-input').type(users.unregisteredUser.email);
      cy.dataCy('password-input').type(users.unregisteredUser.password);
      cy.dataCy('confirmPassword-input').type(
        users.unregisteredUser.confirmPassword
      );
      cy.dataCy('signUp-button').click();
      cy.dataCy('account-created-modal').should('be.visible');
      cy.dataCy('account-created-modal-action').click();
      cy.url()
        .should('include', '/')
        .then(() => {
          cy.task('clearTestUser');
        });
    });
  });

  it('should not allow user to sign in with existing email', () => {
    cy.fixture('userProfiles').then((users) => {
      cy.dataCy('firstName-input').type(users.unregisteredUser.firstName);
      cy.dataCy('lastName-input').type(users.unregisteredUser.lastName);
      cy.dataCy('email-input').type(users.validUser.email);
      cy.dataCy('password-input').type(users.unregisteredUser.password);
      cy.dataCy('confirmPassword-input').type(
        users.unregisteredUser.confirmPassword
      );
      cy.dataCy('email-error').should('contain', 'Email already exists');
      cy.dataCy('signUp-button').should('be.disabled');
    });
  });
});
