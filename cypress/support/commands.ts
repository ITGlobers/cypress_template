// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const chooseRandomSku = (contentElement: JQuery<any>) => {
  const elementsWithoutClass = contentElement.filter(
    (index: number, element: any) =>
      !Cypress.$(element).hasClass(
        "vtex-store-components-3-x-skuSelectorItem--selected"
      )
  );
  if (elementsWithoutClass.length > 0)
    cy.wrap(
      elementsWithoutClass[
        Math.floor(Math.random() * elementsWithoutClass.length)
      ]
    ).click();
};

Cypress.Commands.add("chooseRandomSku", chooseRandomSku);

declare namespace Cypress {
  interface Chainable<Subject> {
    chooseRandomSku(contentElement: JQuery<any>): Chainable<void>;
  }
}
