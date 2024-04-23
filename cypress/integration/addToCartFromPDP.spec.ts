import "../support/vtex";

describe("Add to cart from PDP", () => {
  before(() => {
    cy.setVtexIdCookie();
  });

  it("Click on a product to go to the PDP and then click on the skus to select and finally add to cart", () => {
    cy.visit("/");
    cy.wait(3000);
    cy.fixture("addToCartFromPDP").then((contentElement) => {
      cy.get(contentElement.productSummary)
        .then((content) =>
          content.eq(Math.floor(Math.random() * content.length))
        )
        .click();

      cy.wait(2000);

      cy.get(contentElement.colorSkuOption).then((content) =>
        cy.chooseRandomSku(content)
      );
      cy.wait(1000);

      cy.get(contentElement.sizeSkuOption).then((content) =>
        cy.chooseRandomSku(content)
      );

      cy.wait(3000);
      cy.get(contentElement.addToCartButton).click();

      cy.get(contentElement.cartButton).wait(500).click();
    });
  });
});
