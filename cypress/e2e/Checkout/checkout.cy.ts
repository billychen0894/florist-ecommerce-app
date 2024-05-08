describe('Checkout Tests', () => {
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

    cy.dataCy('product-add-to-cart').click();
    cy.dataCy('header-nav-cart').click();
    cy.url().should('include', '/cart');
    cy.dataCy('cart-items').should('have.length', 1);
    cy.dataCy('order-summary').should('exist');
  });

  it('should trigger a redirection to Stripe Checkout', () => {
    cy.intercept('GET', '**/c/pay/**').as('stripeCheckout');
    cy.dataCy('checkout-button').click();
    cy.wait('@stripeCheckout').then((interception) => {
      expect(interception.request.url).to.include('checkout.stripe.com/c/pay');
    });
  });
});
