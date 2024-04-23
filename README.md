# Cypress Template

This repository is a reference for testing Cypress on VTEX. Provides information about setting up, running Cypress locally, how the script works, and how to run a test.

> [!NOTE]
> This template can only be used by Linux or MacOS users.

## Configuration

### Install dependencies

- `$ yarn`

> [!NOTE]
> Note: 4.5.0 is the Cypress version IO runs your tests on, so we recommend you write and debug your tests using this version.

### Running Cypress locally

To make your test suite reusable across accounts and workspaces, you can take advantage of the `<account>` and `<workspace>`placeholders in your [cypress.json "baseUrl"](./cypress.json):

```json
{
  "baseUrl": "https://<workspace>--<account>.myvtex.com"
}
```

Then make sure to use relative paths in your `cy.visit()` calls.

To make using dynamic `baseUrl` and `*.myvtex.com` authentication painless when running Cypress locally, we provide the [cypress-local.sh](./cypress-local.sh) script.

Replace the workspace and account values that are wrapped between the greater than and less than symbol.

```sh
sed -e "s/<workspace>/\$workspace/" -e "s/<account>/\$account/" cypress.json > $resolvedConfig
```

This script will resolve the baseUrl configured in your [cypress.json](./cypress.json) file using the currently logged-in account and workspace, and also expose the user's local token through the `CYPRESS_authToken` environment variable.

```json
{
  "scripts": {
    "cypress:open": "./cypress-local.sh open",
    "cypress:run": "./cypress-local.sh run"
  }
}
```

### How the script works ?

```sh
token=$(vtex local token)
account=$(vtex local account)
workspace=$(vtex local workspace)
```

- These lines use VTEX tool commands to get the local token, account, and workspace. These values are stored in the token, account and workspace variables, respectively.

```sh
resolvedConfig="resolved-cypress.json"
```

- This line creates a variable called resolvedConfig and assigns it the value "resolved-cypress.json". This variable is used to store the name of the resolved configuration file.

```sh
sed -e "s/<workspace>/\$workspace/" -e "s/<account>/\$account/" cypress.json > $resolvedConfig
```

- This line uses the sed command to replace the `<workspace>` and `<account>` strings in the cypress.json file with the values of the $workspace and $account variables, respectively. The result is redirected to the $resolvedConfig file.

```sh
export CYPRESS_authToken=$token
```

- This line exports the value of the token variable as an environment variable called `CYPRESS_authToken`. This allows the token value to be used in other commands or scripts.

```sh
cmd=$1
shift
```

- These lines assign the first argument passed to the script to the cmd variable and then shift the remaining arguments.

```sh
yarn cypress $cmd -C $resolvedConfig "$@" --browser chrome
```

- This line runs the yarn cypress command with the arguments provided to the script, using the $resolvedConfig configuration file and the Chrome browser.

```sh
rm $resolvedConfig
```

- This line deletes the $resolvedConfig file after the script execution has completed.

## How to run a test?

Everything that has to do with the cypress tests is saved in the **cypress** folder, the architecture of the folders works like this:

- **Folder** `cypress/integration`:

  - This folder contains Cypress tests.
  - This is where test files are created, usually with the `.spec.js` or `.spec.ts` extension.
  - Test files can be organized in subfolders according to the structure you want.

- **Folder** `cypress/support`:

  - This folder contains support files for the tests.
  - This is where custom commands, utility functions and additional settings can be defined.

- **Folder** `cypress/fixtures`:

  - This folder is used to store "variables" or reusable data.
  - You can place `JSON`, `CSV` files or other data formats here to use in your tests.

### Differences between cypress:open and cypress:run

- `cypress:open`

  - Running cypress open opens the Cypress graphical interface.
  - This interface allows you to select and run tests interactively.
  - Provides a real-time view of tests, including step execution, HTTP requests, execution time, number of tests passed and failed, as well as the ability to view screenshots of specific actions.
  - It is useful for test development and debugging as it offers an interactive way of working with Cypress.

- `cypress:run`
  - When you run cypress run, Cypress runs the tests in command line mode, without opening the graphical interface.
  - This mode is faster, since it runs in memory and does not require the preparation of a graphical interface.
  - It is useful for integration into CI/CD pipelines, where automated test execution without human interaction is required.

Now that you know how the cypress folder architecture works and what cypress:open and cypress:run does, you just have to execute:

```sh
yarn run cypress:open
```

or

```sh
yarn run cypress:run
```

## How the Test Add to cart from PDP works

The function of this test is to add a product to the cart from the PDP. This process is carried out as follows:

- Before running the test, the custom command `setVtexIdCookie` is called to set a VTEX ID cookie.

```ts
import "../support/vtex";

describe("Add to cart from PDP", () => {
  before(() => {
    cy.setVtexIdCookie();
  });
  ...
});
```

- The test begins by visiting the main page (home) using the command `cy.visit("/")`. It is important to emphasize that for the test to work correctly, it must start from home, since it selects a product-summary from home.
  The `cy.wait(3000)` is for the page to load properly to prevent errors.

```ts
it("Click on a product to go to the PDP and then click on the skus to select and finally add to cart", () => {
  cy.visit("/");
  cy.wait(3000);
  ...
});
```

- The `cy.fixture()` function is used to load a JSON file called `addToCartFromPDP`. The content of the file is passed as an argument to the callback function. In this case, the content of the file is assigned to the contentElement variable.

```ts
it("Click on a product to go to the PDP and then click on the skus to select and finally add to cart", () => {
  cy.visit("/");
  cy.wait(3000);
  cy.fixture("addToCartFromPDP").then((contentElement) => {
     ...
  });
});
```

- The `cy.get()` function is used to select an element from the DOM. Selects an element that matches the `contentElement.productSummary` CSS selector. The CSS selector is obtained from the content of the `addToCartFromPDP` JSON file. After the element is selected, a callback function is chained using `.then()`. This callback function takes the selected content and uses the `.eq()` method to select a specific element within the elements collection. The element index is randomly generated using `Math.random()` and `Math.floor().`, once the desired element is selected, the `.click()` method is called to simulate a click on the element.

```ts
it("Click on a product to go to the PDP and then click on the skus to select and finally add to cart", () => {
  cy.visit("/");
  cy.wait(3000);
  cy.fixture("addToCartFromPDP").then((contentElement) => {
    cy.get(contentElement.productSummary)
      .then((content) => content.eq(Math.floor(Math.random() * content.length)))
      .click();
      ...
  });
});
```

- In this part of the code we again use `cy.get()` to select the elements from the DOM. In this case we are going to use the CSS selectors `contentElement.colorSkuOption` and `contentElement.sizeSkuOption` that are obtained from the JSON file `addToCartFromPDP` to select the skus. After selecting the elements, a callback function is chained that uses the `.then()` method to pass the selected content to the `cy.chooseRandomSku()` function. The `chooseRandomSku` function is a custom function defined in Cypress that the provided code adds as a new Cypress command.

```ts
it("Click on a product to go to the PDP and then click on the skus to select and finally add to cart", () => {
  cy.visit("/");
  cy.wait(3000);
  cy.fixture("addToCartFromPDP").then((contentElement) => {
    cy.get(contentElement.productSummary)
      .then((content) => content.eq(Math.floor(Math.random() * content.length)))
      .click();
    cy.wait(2000);

    cy.get(contentElement.colorSkuOption).then((content) =>
      cy.chooseRandomSku(content)
    );

    cy.wait(1000);

    cy.get(contentElement.sizeSkuOption).then((content) =>
      cy.chooseRandomSku(content)
    );
    ...
  });
});
```

- In this part of the test we add the product to the cart by doing `cy.get()` to obtain the element from the DOM, we pass to `cy.get()` the CSS selector `contentElement.addToCartButton` that comes from the JSON file " addToCartFromPDP". To that selected element we concatenate a `.click()` to resemble a click.

```ts
it("Click on a product to go to the PDP and then click on the skus to select and finally add to cart", () => {
  cy.visit("/");
  cy.wait(3000);
  cy.fixture("addToCartFromPDP").then((contentElement) => {
    cy.get(contentElement.productSummary)
      .then((content) => content.eq(Math.floor(Math.random() * content.length)))
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
    ...
  });
});
```

- And finally to open the shopping cart we do `cy.get()` to get the element from the DOM, we use the CSS selector `contentElement.cartButton` that comes from the JSON file "addToCartFromPDP" and then we concatenate a `.click()`.

```ts
it("Click on a product to go to the PDP and then click on the skus to select and finally add to cart", () => {
  cy.visit("/");
  cy.wait(3000);
  cy.fixture("addToCartFromPDP").then((contentElement) => {
    cy.get(contentElement.productSummary)
      .then((content) => content.eq(Math.floor(Math.random() * content.length)))
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
```

### How does the chooseRandomSku function work

The function is located in the following path cypress/support/commands.ts

- The `chooseRandomSku` function takes a content Element parameter which is a jQuery object.

```ts
const chooseRandomSku = (contentElement: JQuery<any>) => {
  ...
};
```

- Inside the function, jQuery's `.filter()` method is used to filter the elements of the contentElement object. Items that do not have the `vtex-store-components-3-x-skuSelectorItem--selected` CSS class are filtered out.

```ts
const chooseRandomSku = (contentElement: JQuery<any>) => {
  const elementsWithoutClass = contentElement.filter(
    (index: number, element: any) =>
      !Cypress.$(element).hasClass(
        "vtex-store-components-3-x-skuSelectorItem--selected"
      )
  );
  ...
};
```

- It checks if there are filtered items available to select. If the length of `elementsWithoutClass` is greater than zero, it means that there are elements without the class `vtex-store-components-3-x-skuSelectorItem--selected` and one can be selected randomly. Cypress's `.wrap()` method is used to wrap the randomly selected element in a Cypress object. The `.click()` method is then called to simulate a click on the element.

```ts
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
```

The code adds the chooseRandomSku function as a new Cypress command using `Cypress.Commands.add()`. This allows the function to be used as a custom command in Cypress tests.

```ts
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
```

- The code declares a custom namespace in Cypress to extend the Chainable interface and add the `chooseRandomSku` command. This allows the command to be used seamlessly in Cypress command strings.

```ts
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
```

## Contact

CC: Daniel Velasco / daniel.velasco@itglobers.com
