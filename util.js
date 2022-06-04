import dotenv from "dotenv";
import axios from "axios";
import {
  card,
  first,
  last,
  street,
  zip,
  company,
  city,
  state,
} from "./data.js";
dotenv.config();

export const baseUrl = "https://apitest.authorize.net/xml/v1/request.api";

export const authentication = {
  name: process.env.AUTH_NET_NAME,
  transactionKey: process.env.AUTH_NET_KEY,
};

export const pickRand = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const formatTransactions = (transactions) => {
  if (transactions) {
    const frontEndTransactions = transactions.map((trans) => {
      const newDate = new Date(trans.submitTimeLocal).toLocaleDateString();
      const newTime = new Date(trans.submitTimeLocal).toLocaleTimeString();
      let newStatus = null;
      switch (trans.transactionStatus) {
        case "capturedPendingSettlement":
          newStatus = "Pending Settlement";
          break;
        case "settledSuccessfully":
          newStatus = "Settled";
          break;
        case "FDSPendingReview":
          newStatus = "Needs review";
          break;
        case "voided":
          newStatus = "Voided";
          break;
        case "refundPendingSettlement":
          newStatus = "Refund Pending";
          break;
        case "declined":
          newStatus = "Declined";
          break;
        case "expired":
          newStatus = "EXPIRED";
          break;
        case "refundSettledSuccessfully":
          newStatus = "Refunded";
          break;
        case "generalError":
          newStatus = "General Error";
          break;
      }
      let newType = null;
      if (trans.transactionType) {
        switch (trans.transactionType) {
          case "authCaptureTransaction":
            newType = "Auth Capture";
            break;
          case "refundTransaction":
            newType = "Refund";
            break;
        }
      }
      const newTranObj = {
        ...trans,
        submitTimeLocal: `${newDate + " " + newTime}`,
        transactionStatus: newStatus,
        transactionType: newType,
      };
      return newTranObj;
    });
    return frontEndTransactions;
  } else {
    return [];
  }
};

export const searchUnsettledTransactions = async (body) => {
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

const getBatch = async (id, offset) => {
  const response = await axios.post(baseUrl, {
    getTransactionListRequest: {
      merchantAuthentication: authentication,
      batchId: id,
      sorting: {
        orderBy: "submitTimeUTC",
        orderDescending: "true",
      },
      paging: {
        limit: "20",
        offset: offset,
      },
    },
  });
  const data = response.data;
  return data;
};

export const searchSettledTransactions = async (body) => {
  const response = await axios.post(baseUrl, {
    getSettledBatchListRequest: {
      merchantAuthentication: authentication,
      firstSettlementDate: `${body.firstDate}T00:00:00Z`,
      lastSettlementDate: `${body.firstDate}T00:00:00Z`,
    },
  });
  if (!response.data.batchList) {
    return [];
  } else {
    const batchId = response.data.batchList[0].batchId;
    const batchTrans = await getBatch(batchId, body.offset);
    const data = formatTransactions(batchTrans.transactions);
    return data;
  }
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
            cardNumber: pickRand(card),
            expirationDate: "2025-12",
            cardCode: "232",
          },
        },
        billTo: {
          firstName: pickRand(first),
          lastName: pickRand(last),
          company: pickRand(company),
          address: pickRand(street),
          city: pickRand(city),
          state: pickRand(state),
          zip: pickRand(zip),
          country: "US",
        },
        shipTo: {
          firstName: pickRand(first),
          lastName: pickRand(last),
          company: pickRand(company),
          address: pickRand(street),
          city: pickRand(city),
          state: pickRand(state),
          zip: "66215",
          country: "US",
        },
      },
    },
  });
  return response.data.transactionResponse;
};

export const searchTransactions = async (body) => {
  try {
    if (body.status === "unsettled") {
      const response = await searchUnsettledTransactions(body);
      return response;
    }
    if (body.status === "settled") {
      const response = await searchSettledTransactions(body);
      return response;
    }
    return ["Invalid request: Request body format incorrect"]
  } catch (e) {
    console.log(e)
    return e
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

export const getFormToken = async (body) => {
  const { amount, first, last, company, street, city, state, zip, country } =
    body.bodyState;
  const response = await axios.post(baseUrl, {
    getHostedPaymentPageRequest: {
      merchantAuthentication: authentication,
      transactionRequest: {
        transactionType: "authCaptureTransaction",
        amount: amount.value,
        billTo: {
          firstName: first.value,
          lastName: last.value,
          company: company.value,
          address: street.value,
          city: city.value,
          state: state.value,
          zip: zip.value,
          country: country.value,
        },
      },
      hostedPaymentSettings: {
        setting: [
          {
            settingName: "hostedPaymentReturnOptions",
            settingValue:
              '{"showReceipt": true, "url": "http://localhost:3000/", "urlText": "Continue", "cancelUrl": "http://localhost:3000/", "cancelUrlText": "Cancel"}',
          },
          {
            settingName: "hostedPaymentButtonOptions",
            settingValue: '{"text": "Pay"}',
          },
          {
            settingName: "hostedPaymentStyleOptions",
            settingValue: '{"bgColor": "rgb(251, 133, 0)"}',
          },
          {
            settingName: "hostedPaymentPaymentOptions",
            settingValue:
              '{"cardCodeRequired": false, "showCreditCard": true, "showBankAccount": true}',
          },
          {
            settingName: "hostedPaymentSecurityOptions",
            settingValue: '{"captcha": false}',
          },
          {
            settingName: "hostedPaymentShippingAddressOptions",
            settingValue: '{"show": false, "required": false}',
          },
          {
            settingName: "hostedPaymentBillingAddressOptions",
            settingValue: '{"show": true, "required": false}',
          },
          {
            settingName: "hostedPaymentCustomerOptions",
            settingValue:
              '{"showEmail": false, "requiredEmail": false, "addPaymentProfile": true}',
          },
          {
            settingName: "hostedPaymentOrderOptions",
            settingValue: '{"show": true, "merchantName": "authNetFront Inc"}',
          },
          {
            settingName: "hostedPaymentIFrameCommunicatorUrl",
            settingValue: '{"url": "https://mysite.com/special"}',
          },
        ],
      },
    },
  });
  return response.data;
};

export const getBatchStats = async (id) => {
  const response = await axios.post(baseUrl, {
    getBatchStatisticsRequest: {
        merchantAuthentication: authentication,
        batchId: id
    }
}
)

return response.data.batch}


export const last7Totals = async () => {
  const last7Totals = [];
  const today = new Date();
  const aWeekAgoMilli = new Date().setDate(today.getDate() - 7)
  const lastWeek = new Date(aWeekAgoMilli)
  const response = await axios.post(baseUrl, {
    getSettledBatchListRequest: {
      merchantAuthentication: authentication,
      firstSettlementDate: lastWeek,
      lastSettlementDate: today.toISOString(),
    },
  });
  for(let batch of response.data.batchList) {
    const response = await getBatchStats(batch.batchId)
    const date = response.settlementTimeLocal;
    const cardTotals = response.statistics.map((stats) => {
      return stats.chargeAmount + stats.refundAmount;
    })
    const chargeTotal = cardTotals.reduce((cur, acc) => cur + acc)
    last7Totals.push({
      date: date,
      total: chargeTotal
    })
  }
  return last7Totals;
}