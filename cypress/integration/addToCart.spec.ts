import "../support/vtex";

describe("Add to cart", () => {
  before(() => {
    cy.setVtexIdCookie();
  });

  it("Randomly select a product-summary and click the add-to-cart-button", () => {
    cy.visit("/");
    cy.wait(3000);
    cy.fixture(
      "addToCart"
    ).then(
      (
        contextElement
      ) => {
        cy.get(
          contextElement.productSummary
        )
          .find(
            contextElement.addToCartButton
          )
          .then(
            (
              content
            ) =>
              content.eq(
                Math.floor(
                  Math.random() *
                    content.length
                )
              )
          )
          .click();
      }
    );
  });
});
