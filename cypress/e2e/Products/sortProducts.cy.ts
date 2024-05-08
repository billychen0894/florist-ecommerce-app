describe('Sort Products Tests', () => {
  beforeEach(() => {
    cy.visit('/products');
    cy.url().should('include', '/products');
    cy.get('[data-cy="products"] > div').should('have.length', 12);
  });

  it('should sort products by most popular product', () => {
    cy.dataCy('sort-btn').should('be.visible').click();
    cy.dataCy('sort-popular').should('be.visible').click();
    cy.url().should('include', '/products?sort=popular');
  });

  it('should sort products by price low to high', () => {
    cy.dataCy('sort-btn').should('be.visible').click();
    cy.dataCy('sort-price-low-to-high').should('be.visible').click();
    cy.url().should('include', '/products?sort=price-low-to-high');
  });

  it('should sort products by price high to low', () => {
    cy.dataCy('sort-btn').should('be.visible').click();
    cy.dataCy('sort-price-high-to-low').should('be.visible').click();
    cy.url().should('include', '/products?sort=price-high-to-low');
  });

  it('should sort products by newest arrivals', () => {
    cy.dataCy('sort-btn').should('be.visible').click();
    cy.dataCy('sort-newest').should('be.visible').click();
    cy.url().should('include', '/products?sort=newest');
  });
});
