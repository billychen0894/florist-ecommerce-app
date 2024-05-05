describe('Filter Products Tests', () => {
  const sizes: Cypress.ViewportPreset[] = ['iphone-6', 'macbook-15'];

  sizes.forEach((size) => {
    const isMobile = size === 'iphone-6';
    context(`Filter Products Test on ${size}`, () => {
      beforeEach(() => {
        cy.viewport(size);
        cy.visit('/products');
        cy.url().should('include', '/products');
        cy.get('[data-cy="products"] > div').should('have.length', 12);
      });

      it('should filter products by category', () => {
        if (isMobile) {
          cy.dataCy('mobile-filter-btn').should('be.visible').click();
          cy.dataCy('mobile-filter-dialog').should('be.visible');
          cy.dataCy('filter-Category-btn').should('be.visible').click();
          cy.dataCy('filter-Category-Bouquets-btn')
            .should('be.visible')
            .click();
          cy.dataCy('filter-Category-Bouquets-btn')
            .find('input')
            .should('be.checked');
          cy.url().should('include', '/products?page=1&category=Bouquets');
        } else {
          cy.dataCy('filter-btn').should('be.visible').click();
          cy.dataCy('filter-panel').should('be.visible');
          cy.dataCy('filter-Bouquets-btn').should('be.visible').click();
          cy.dataCy('filter-Bouquets-btn').find('input').should('be.checked');
          cy.url().should('include', '/products?page=1&category=Bouquets');
        }
      });
    });
  });
});
