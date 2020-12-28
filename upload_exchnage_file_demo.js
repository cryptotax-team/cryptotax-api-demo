"use strict";
require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");
const FormData = require("form-data");

(async () => {
  try {
    const requestId = await uploadFileToConvert(createFileUploadRequestData());
    console.log(
        `File to process submitted with request id ${requestId}. Now polling for results...`
    );

    const result = await pollForFileConvertResult(requestId);
    console.log("File processing was finished successfully!");
    console.log(
        `List of converted transactions:\n${JSON.stringify(
            result.convertedTransactions,
            null,
            2
        )}`
    );
  } catch (err) {
    console.error("Error", err);
  }
})();

async function uploadFileToConvert(fileUploadFormData) {
  let response = await postApi(
      `${process.env.CSV_API_BASE_URL}/convertTransactions`,
      fileUploadFormData
  );
  const requestConvertFileJson = await response.json();

  const { requestId } = requestConvertFileJson;
  if (!requestId) {
    throw new Error(`Error: ${JSON.stringify(requestConvertFileJson)}`);
  }

  return requestId;
}

async function pollForFileConvertResult(requestId) {
  let pollingAttempts = 0;
  const maxPollingAttempts = 100;
  const delayInMillis = 1000;

  while (pollingAttempts < maxPollingAttempts) {
    await sleep(delayInMillis);

    const response = await getApi(
        `${process.env.CSV_API_BASE_URL}/convertTransactions/${requestId}`
    );
    const checkResultJson = await response.json();

    const { status } = checkResultJson;
    console.log(`File processing status: ${status}`);

    if (status === "SUCCESS") {
      return checkResultJson;
    } else if (status === "ERROR") {
      throw new Error(
          `Error during file processing: ${JSON.stringify(checkResultJson)}`
      );
    }

    pollingAttempts++;
  }
  throw new Error(`File processing still not finished. Try again later.`);
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

async function postApi(url, formData) {
  let headers = {
    Authorization: `Bearer ${process.env.API_TOKEN}`,
  };
  return await fetch(url, {
    method: "POST",
    headers: headers,
    body: formData,
  });
}

const sleep = (millis) => new Promise((resolve) => setTimeout(resolve, millis));

function createFileUploadRequestData() {
  const formData = new FormData();
  formData.append("file", fs.createReadStream("Poloniex_deposits.csv"));
  formData.append("filename", "uploaded_file_name.csv");
  formData.append("format", "csv");
  formData.append("accountName", "Your exchange account name");

  // id of exchange from which file was exported (all supported exchanges you can get from /api/v1/exchanges endpoint)
  formData.append("importType", "deposits");

  formData.append("exchangeId", 1);

  return formData;
}