# CryptoTax API demo

This simple NodeJS application demonstrates how to use the CryptoTax API for creating tax reports.

## Decstiption

For using API you need API token. To get API token please reaching out at contact@cryptotax.io for more details, or visit the [CryptoTax.io website](https://cryptotax.io/).

### Tax reports calculation

First, the script creates a tax report calculation request using the `/requestReportCalculation` API endpoint. Then, it polls the `/checkResult` API endpoint until the tax report is ready for download. The URL to download the report will we printed to the console.

You can find all details about this demo in file `create_report_demo.js`.

Please consult the [CryptoTax API documentation](https://api-docs.cryptotax.io/) for more information.

## Requirements
* NodeJS

## Usage instructions

1. Clone the Git repository
1. Copy the file `.env.template` and rename it to `.env`
1. Replace `<YOUR_CRYPTOTAX_API_TOKEN>` in the `.env` file with your individual CryptoTax API token
1. Run `npm install` command
1. Run `npm run create_report_demo` to execute the demo application for creating tax report
1. Wait until the script finishes. Watch the log console for status updates.
1. The URL to download the PDF report will be printed to the console.

=========================================================================================

# CryptoTax CSV API demo

This simple NodeJS application demonstrates how to use the CryptoTax CSV API for converting files that was imported from exchanges.

## Decstiption

For using API you need API token. To get API token please reaching out at contact@cryptotax.io for more details, or visit the [CryptoTax.io website](https://cryptotax.io/).

### Exchange files processing

First, the script creates a file process request using the `/convertTransactions` API endpoint. Then, it polls the `/convertTransactions/{{requestId}}` API endpoint until the file is processed and result is ready for download. The transactions that were converted from exchange file we printed to the console.

You can find all details about this demo in file `upload_exchnage_file_demo.js`.

Please consult the [CryptoTax CSV API documentation](https://csv-api-docs.cryptotax.io/) for more information.

## Requirements
* NodeJS

## Usage instructions

1. Clone the Git repository
1. Copy the file `.env.template` and rename it to `.env`
1. Replace `<YOUR_CRYPTOTAX_API_TOKEN>` in the `.env` file with your individual CryptoTax API token
1. Run `npm install` command
1. Run `npm run upload_exchnage_file_demo` to execute the demo application for processing exchange file
1. Wait until the script finishes. Watch the log console for status updates.
1. The URL to download the list of transactions will be printed to the console.