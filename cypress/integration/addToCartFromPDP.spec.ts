import "../support/vtex";

describe("Add to cart from PDP", () => {
  before(() => {
    cy.setVtexIdCookie();
  });

  it("Select a product summary and click to go to the PDP and add the product to the cart", () => {
    cy.visit("/");
    cy.wait(3000);
    cy.fixture("addToCartFromPDP").then((contentElement) => {
      cy.get(contentElement.productSummary)
        .then((content) =>
          content.eq(Math.floor(Math.random() * content.length))
        )
        .click();
      cy.wait(3000);
      cy.get(contentElement.addToCartButton).click();

      cy.get(contentElement.cartButton).wait(500).click();
    });
  });
});
