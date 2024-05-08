describe('Add Product to Cart Tests', () => {
  beforeEach(() => {
    cy.visit('/products');
    cy.url().should('include', '/products');
    cy.get('[data-cy="products"] > div').should('have.length', 12);
    cy.get('[data-cy="products"] > div').first().click();
    cy.url().should(
      'match',
      /\/products\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
    );
    [
      'main-image',
      'images',
      'name',
      'price',
      'description',
      'category',
      'add-to-cart',
      'add-to-wishlist',
    ].forEach((detail) => {
      cy.dataCy(`product-${detail}`).should('exist');
    });
  });

  it('should allow users to add product to cart', () => {
    cy.dataCy('product-add-to-cart').click();
    cy.dataCy('header-nav-cart').click();
    cy.url().should('include', '/cart');
    cy.dataCy('cart-items').should('have.length', 1);
    cy.dataCy('order-summary').should('exist');
  });
});
