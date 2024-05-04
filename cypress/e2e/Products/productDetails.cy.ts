describe('Product Details Tests', () => {
  beforeEach(() => {
    cy.visit('/products');
    cy.url().should('include', '/products');
    cy.get('[data-cy="products"] > div').should('have.length', 12);
  });

  it('should navigate to product details page by clicking one of the products', () => {
    const expectedDetails = ['Product', 'Care', 'Delivery'];

    // testing just the first product for simplicity
    cy.get('[data-cy="products"] > div').first().click();
    cy.url().should(
      'match',
      /\/products\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
    );

    // Validate main product details are visible
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

    // Validate product details items
    cy.get('[data-cy=productDetailItems] > div').should('have.length', 3);
    cy.dataCy('productDetailItems').within(() => {
      cy.get('div[data-cy^="productDetailItems-"]').each(($detail, index) => {
        cy.wrap($detail)
          .find('span[data-cy]')
          .invoke('text')
          .should('eq', expectedDetails[index]);
      });
    });

    // Optionally check interaction within each detail item
    expectedDetails.forEach((detail) => {
      cy.dataCy(`productDetailItems-${detail}-btn`).click();
      cy.dataCy(`productDetailItems-${detail}-detailList`).should(
        'have.length.gte',
        1
      );
    });

    // Check for recommendations
    cy.get('[data-cy=products-recommendation] > div').should('have.length', 4);
  });
});
