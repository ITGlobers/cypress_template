import "../support/vtex";

describe("Add to cart from PDP", () => {
  before(() => {
    cy.setVtexIdCookie();
  });

  it("Select a product summary and click to go to the PDP and add the product to the cart", () => {
    cy.visit("/");
    cy.wait(3000);
    cy.fixture("addToCartFromPDP").then((contentElement) => {
      cy.get(contentElement.productSummaryContainer).first().click();
      cy.wait(5000);
      cy.get(contentElement.productInfoData)
        .find(contentElement.addToCartButton)
        .click();
    });
  });
});
