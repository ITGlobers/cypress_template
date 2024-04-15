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

## Contact

CC: Daniel Velasco / daniel.velasco@itglobers.com
