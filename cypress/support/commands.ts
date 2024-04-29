// / <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      dataCy(
        value: string,
        options?: Partial<Loggable & Timeoutable & Withinable & Shadow>
      ): Chainable<Element>;
    }
  }
}

Cypress.Commands.add('dataCy', (value, options) => {
  cy.get(`[data-cy=${value}]`, options);
});

// Prevent TypeScript from reading file as legacy script
export {};
