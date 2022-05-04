import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const baseUrl = "https://apitest.authorize.net/xml/v1/request.api";

const authentication = {
  name: process.env.AUTH_NET_NAME,
  transactionKey: process.env.AUTH_NET_KEY,
};

export const formatTransactions = (transactions) => {
  const frontEndTransactions = transactions.map((trans) => {
    const newDate = new Date(trans.submitTimeLocal).toLocaleDateString();
    const newTime = new Date(trans.submitTimeLocal).toLocaleTimeString();
    const newStatus =
      trans.transactionStatus === "capturedPendingSettlement"
        ? "Pending Settlement"
        : "settled" || "Other";
    const newTranObj = {
      ...trans,
      submitTimeLocal: `${newDate + " " + newTime}`,
      transactionStatus: newStatus,
    };
    return newTranObj;
  });
  return frontEndTransactions;
};

export const generateTransaction = async () => {
  const amount = ((Math.random() * 10000) / 100).toFixed(2);
  const response = await axios.post(baseUrl, {
    createTransactionRequest: {
      merchantAuthentication: authentication,
      refId: "optionaluniqueId",
      transactionRequest: {
        transactionType: "authCaptureTransaction",
        amount: amount,
        payment: {
          creditCard: {
            cardNumber: "4007000000027",
            expirationDate: "2025-12",
            cardCode: "232",
          },
        },
        billTo: {
          firstName: "Test",
          lastName: "Customer",
          company: "Google",
          address: "12 Main Street",
          city: "Lenexa",
          state: "KS",
          zip: "66215",
          country: "US",
        },
        shipTo: {
          firstName: "Test",
          lastName: "Customer",
          company: "Google",
          address: "12 Main Street",
          city: "Lenexa",
          state: "KS",
          zip: "66215",
          country: "US",
        },
      },
    },
  });
  return response.data.transactionResponse;
};

const searchUnsettledTransactions = async (body) => {
  const response = await axios.post(baseUrl, {
    getUnsettledTransactionListRequest: {
      merchantAuthentication: authentication,
      sorting: {
        orderBy: "submitTimeUTC",
        orderDescending: true,
      },
      paging: {
        limit: "20",
        offset: body.offset,
      },
    },
  });

  if (!response.data.transactions) {
    return [];
  }

  const data = await formatTransactions(response.data.transactions);
  return data;
};

const getBatch = async (id) => {
  const response = await axios.post(baseUrl, {
    getTransactionListRequest: {
      merchantAuthentication: authentication,
      batchId: id,
      sorting: {
        orderBy: "submitTimeUTC",
        orderDescending: "true",
      },
      paging: {
        limit: "100",
        offset: "1",
      },
    },
  });
  const data = response.data;
  return data;
};

const searchSettledTransactions = async (body) => {
  console.log(body);
  const response = await axios.post(baseUrl, {
    getSettledBatchListRequest: {
      merchantAuthentication: authentication,
      firstSettlementDate: `${body.firstDate}T00:00:00Z`,
      lastSettlementDate: `${body.lastDate}T00:00:00Z`,
    },
  });

  if (!response.data.batchList) {
    return [];
  } else {
    let totalTransactions = [];
    const batches = response.data.batchList;
    for (let batch of batches) {
      const data = await getBatch(batch.batchId);
      const transactions = data.transactions;
      for (let i = 0; i < transactions.length; i++) {
        totalTransactions.push(transactions[i]);
      }
    }
    const data = formatTransactions(totalTransactions);
    return data;
  }
};

export const searchTransactions = async (body) => {
  if (body.status === "unsettled") {
    const response = await searchUnsettledTransactions(body);
    return response;
  }
  if (body.status === "settled") {
    const response = await searchSettledTransactions(body);
    return response;
  }
};
