describe('Search Products Tests', () => {
  beforeEach(() => {
    cy.visit('/products');
    cy.url().should('include', '/products');
    cy.get('[data-cy="products"] > div').should('have.length', 12);
  });

  it('should search for products by name', () => {
    cy.dataCy('header-search').should('be.visible').click();
    cy.dataCy('search-input').type('bouquet{enter}');
    cy.url().should('include', '/products?keyword=bouquet');
    cy.dataCy('products').within(() => {
      cy.dataCy('product-name').each(($product) => {
        cy.wrap($product).should('contain.text', 'Bouquet');
      });
    });
  });
});
