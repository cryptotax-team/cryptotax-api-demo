require("dotenv").config();
const fetch = require("node-fetch");

(async () => {
  try {
    const requestId = await requestReportCalculation(
      createCalculationRequestData()
    );
    console.log(
      `Report calculation task submitted with request id ${requestId}. Now polling for results...`
    );

    const calculationResults = await pollForCalculationResult(requestId);
    if (calculationResults.warnings) {
      console.log(
        `Calculation finished with warnings: ${JSON.stringify(
          calculationResults.warnings
        )}`
      );
    } else {
      console.log("Calculation finished successfully!");
    }
    console.log(
      `You can download your PDF report here:\n${calculationResults.taxReportUrl}`
    );
  } catch (err) {
    console.error(err);
  }
})();

async function requestReportCalculation(calculationRequestData) {
  const response = await postApi(
    `${process.env.API_BASE_URL}/requestReportCalculation`,
    calculationRequestData
  );
  const requestCalculationJson = await response.json();

  const { requestId } = requestCalculationJson;
  if (!requestId) {
    throw new Error(`Error: ${JSON.stringify(requestCalculationJson)}`);
  }

  return requestId;
}

async function pollForCalculationResult(requestId) {
  let pollingAttempts = 0;
  const maxPollingAttempts = 100;
  const delayInMillis = 1000;

  while (pollingAttempts < maxPollingAttempts) {
    await sleep(delayInMillis);

    const response = await getApi(
      `${process.env.API_BASE_URL}/checkResult?request_id=${requestId}`
    );
    const checkResultJson = await response.json();

    const { status } = checkResultJson;
    console.log(`Calculation status: ${status}`);

    if (status === "COMPLETED" || status === "WARNING") {
      return checkResultJson;
    } else if (status === "ERROR") {
      throw new Error(
        `Error during report calculation: ${JSON.stringify(checkResultJson)}`
      );
    }

    pollingAttempts++;
  }
  throw new Error(`Report calculation still not finished. Try again later.`);
}

function getApi(url) {
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });
}

function postApi(url, requestJson) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
    body: JSON.stringify(requestJson),
  });
}

const sleep = (millis) => new Promise((resolve) => setTimeout(resolve, millis));

function createCalculationRequestData() {
  // you can get all asset information from /assets API endpoint
  const ASSET_ID_BTC = 343;
  const ASSET_ID_BCH = 208;
  const ASSET_ID_ETH = 857;
  const ASSET_ID_EUR = 870;
  const ASSET_ID_CHF = 463;
  const ASSET_ID_USD = 2335;

  return {
    trades: [
      {
        transactionId: 1,
        accountName: "account",
        exchangeName: "exchange",
        tradeDate: "2018-09-13T23:30:52.123Z",
        type: "deposit",
        buyAmount: 20,
        buyAssetId: ASSET_ID_BTC,
        adjustmentType: "linkedwithdrawal",
        linkedTransactionId: "4",
        comment: "Some comment",
      },
      {
        transactionId: 2,
        accountName: "account_2",
        exchangeName: "exchange",
        tradeDate: "2018-11-12T23:29:52.123Z",
        type: "deposit",
        buyAmount: 12,
        buyAssetId: ASSET_ID_BCH,
        adjustmentType: "hardfork",
        hardforkDate: "2018-09-15T22:00:00.000Z",
        hardforkAssetId: ASSET_ID_BTC,
        hardforkExchangeName: "exchange",
        hardforkAccountName: "account",
      },
      {
        transactionId: 3,
        accountName: "account",
        exchangeName: "exchange",
        tradeDate: "2018-09-14T23:31:52.123Z",
        type: "trade",
        buyAmount: 10,
        buyAssetId: ASSET_ID_ETH,
        sellAmount: 0.01,
        sellAssetId: ASSET_ID_BTC,
      },
      {
        transactionId: 4,
        accountName: "account_2",
        exchangeName: "exchange",
        tradeDate: "2018-09-13T23:29:52.123Z",
        type: "withdrawal",
        sellAmount: 20,
        sellAssetId: ASSET_ID_BTC,
      },
      {
        transactionId: 5,
        accountName: "account",
        exchangeName: "exchange",
        tradeDate: "2018-09-13T23:28:52.123Z",
        type: "deposit",
        buyAmount: 0.01,
        buyAssetId: ASSET_ID_BTC,
        adjustmentType: "otcsell",
      },
      {
        transactionId: 6,
        accountName: "account",
        exchangeName: "exchange",
        tradeDate: "2018-12-14T23:30:52.123Z",
        type: "deposit",
        buyAmount: 0.01,
        buyAssetId: ASSET_ID_BTC,
        adjustmentType: "icoinflow",
        linkedTransactionIds: [7, 8],
      },
      {
        transactionId: 7,
        accountName: "account_2",
        exchangeName: "exchange",
        tradeDate: "2018-11-14T22:30:52.123Z",
        type: "withdrawal",
        sellAmount: 2.5,
        sellAssetId: ASSET_ID_BCH,
      },
      {
        transactionId: 8,
        accountName: "account_2",
        exchangeName: "exchange",
        tradeDate: "2018-11-14T22:30:52.123Z",
        type: "withdrawal",
        sellAmount: 3,
        sellAssetId: ASSET_ID_BCH,
      },
    ],
    baseAssetId: ASSET_ID_EUR,
    taxCountryCode: "DE",
    format: "pdf",
    taxYear: 2018,
  };
}
