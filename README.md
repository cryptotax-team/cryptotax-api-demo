# CryptoTax API demo

This simple NodeJS application demonstrates how to use the CryptoTax API for creating tax reports.

First, the script creates a tax report calculation request using the `/requestReportCalculation` API endpoint. Then, it polls the `/checkResult` API endpoint until the tax report is ready for download. The URL to download the report will we printed to the console.

You can find all details about this demo in file `index.js`.

Please consult the [CryptoTax API documentation](https://api-docs.cryptotax.io/) for more information.

If you haven't requested an API token yet, please reach out at contact@cryptotax.io for more details, or visit the [CryptoTax.io website](https://cryptotax.io/).

## Requirements
* NodeJS

## Usage instructions

1. Clone the Git repository
1. Copy the file `.env.template` and rename it to `.env`
1. Replace `<YOUR_CRYPTOTAX_API_TOKEN>` in the `.env` file with your individual CryptoTax API token
1. Run `npm install` command
1. Run `npm start` to execute the demo application
1. Wait until the script finishes. Watch the log console for calculation status updates.
1. The URL to download the PDF report will be printed to the console.