import axios from "axios";
import {
  baseUrl,
  authentication,
  pickRand,
  searchSettledTransactions,
  searchUnsettledTransactions,
  formatTransactions,
} from "../util.js";
import { zip, card } from "../data.js";

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
            cardNumber: pickRand(card),
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
          zip: pickRand(zip),
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

export const getTransaction = async (id) => {
  const response = await axios.post(baseUrl, {
    getTransactionDetailsRequest: {
      merchantAuthentication: authentication,
      transId: id,
    },
  });
  const data = formatTransactions([response.data.transaction]);
  const newData = data[0];
  return newData;
};

export const voidTransaction = async (id) => {
  const response = await axios.post(baseUrl, {
    createTransactionRequest: {
      merchantAuthentication: authentication,
      refId: "voidThisTransaction",
      transactionRequest: {
        transactionType: "voidTransaction",
        refTransId: id,
      },
    },
  });
  if (response.data) {
    return response.data;
  }
  return [];
};

export const refundTransaction = async (body) => {
  const response = await axios.post(baseUrl, {
    createTransactionRequest: {
      merchantAuthentication: authentication,
      transactionRequest: {
        transactionType: "refundTransaction",
        amount: body.amount,
        payment: {
          creditCard: {
            cardNumber: body.cardNumber.slice(3),
            expirationDate: "XXXX",
          },
        },
        refTransId: body.id,
      },
    },
  });
  if (response.data) {
    return response.data;
  }
  return [];
};

generateTransaction();
generateTransaction();
