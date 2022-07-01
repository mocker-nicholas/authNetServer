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

////////////////////////// Utility Functions /////////////////////////////////////
////////////////////////// Utility Functions /////////////////////////////////////
////////////////////////// Utility Functions /////////////////////////////////////
export const baseUrl = "https://apitest.authorize.net/xml/v1/request.api";

export const authentication = {
  name: process.env.AUTH_NET_NAME,
  transactionKey: process.env.AUTH_NET_KEY,
};

export const pickRand = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const randId = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export class Invoice {
  constructor(
    invoice_number,
    address,
    city,
    state,
    zip,
    first_name,
    last_name,
    job_description,
    paid,
    amount
  ) {
    (this.invoice_number = invoice_number),
      (this.address = address),
      (this.city = city),
      (this.state = state),
      (this.zip = zip),
      (this.first_name = first_name),
      (this.last_name = last_name),
      (this.job_description = job_description),
      (this.paid = paid),
      (this.amount = amount);
  }
}

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

////////////////////////// Transaction Searches /////////////////////////////////////
////////////////////////// Transaction Searches /////////////////////////////////////
////////////////////////// Transaction Searches /////////////////////////////////////
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

export const daysTransactions = async (day) => {
  const firstDate = day.substring(0, 10);
  const response = await axios.post(baseUrl, {
    getSettledBatchListRequest: {
      merchantAuthentication: authentication,
      firstSettlementDate: `${firstDate}T00:00:00Z`,
      lastSettlementDate: `${firstDate}T00:00:00Z`,
    },
  });
  if (response.data.batchList) {
    let offset = 1;
    let arrLength = 20;
    let transactions = [];
    while (arrLength === 20) {
      const batchTrans = await getBatch(
        response.data.batchList[0].batchId,
        offset
      );
      if (!batchTrans.transactions) {
        const totalAmount = transactions
          .map((tran) => tran.settleAmount)
          .reduce((curr, accum) => parseFloat(curr) + parseFloat(accum));
        return { date: firstDate, amount: parseFloat(totalAmount).toFixed(2) };
      }
      arrLength = batchTrans.transactions.length;
      batchTrans.transactions.map((tran) => transactions.push(tran));
      offset++;
    }
    const totalAmount = transactions
      .map((tran) => tran.settleAmount)
      .reduce((curr, accum) => parseFloat(curr) + parseFloat(accum));
    return { date: firstDate, amount: parseFloat(totalAmount).toFixed(2) };
  } else {
    return { date: firstDate, amount: "0.00" };
  }
};

export const monthsTransactions = async (year, month) => {
  const date = new Date(Date.UTC(year, month, 1));
  const days = [];
  while (date.getUTCMonth() === month) {
    days.push(new Date(date));
    date.setUTCDate(date.getUTCDate() + 1);
  }
  const totals = await Promise.all(
    days.map(async (day) => {
      const result = await daysTransactions(day.toISOString());
      return result;
    })
  );
  return totals;
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
    return ["Invalid request: Request body format incorrect"];
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const getTransaction = async (id) => {
  const response = await axios.post(baseUrl, {
    getTransactionDetailsRequest: {
      merchantAuthentication: authentication,
      transId: id,
    },
  });
  if (response.data.messages.resultCode !== "Ok") {
    return { error: "Resource was not found, please try again" };
  }
  const data = formatTransactions([response.data.transaction]);
  const newData = data[0];
  return newData;
};

////////////////////////// Process Transactions /////////////////////////////////////
////////////////////////// Process Transactions /////////////////////////////////////
////////////////////////// Process Transactions /////////////////////////////////////
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
    body;
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
              '{"showReceipt": true, "url": "https://main--benevolent-scone-9283d1.netlify.app/", "urlText": "Continue", "cancelUrl": "https://main--benevolent-scone-9283d1.netlify.app/", "cancelUrlText": "Cancel"}',
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
      batchId: id,
    },
  });

  return response.data.batch;
};

////////////////////////// Custom Workflows /////////////////////////////////////
////////////////////////// Custom Workflows /////////////////////////////////////
////////////////////////// Custom Workflows /////////////////////////////////////
export const last7Totals = async () => {
  const last7Totals = [];
  const today = new Date();
  const aWeekAgoMilli = new Date().setDate(today.getDate() - 7);
  const lastWeek = new Date(aWeekAgoMilli);
  const response = await axios.post(baseUrl, {
    getSettledBatchListRequest: {
      merchantAuthentication: authentication,
      firstSettlementDate: lastWeek,
      lastSettlementDate: today.toISOString(),
    },
  });
  for (let batch of response.data.batchList) {
    const response = await getBatchStats(batch.batchId);
    const date = response.settlementTimeLocal;
    const cardTotals = response.statistics.map((stats) => {
      return stats.chargeAmount + stats.refundAmount;
    });
    const chargeTotal = cardTotals.reduce((cur, acc) => cur + acc);
    last7Totals.push({
      date: date,
      total: chargeTotal,
    });
  }
  return last7Totals;
};

export const getUnsettledTotal = async () => {
  let offset = 1;
  let arrLength = 20;
  let transactions = [];
  while (arrLength === 20) {
    const response = await axios.post(baseUrl, {
      getUnsettledTransactionListRequest: {
        merchantAuthentication: authentication,
        sorting: {
          orderBy: "submitTimeUTC",
          orderDescending: true,
        },
        paging: {
          limit: "20",
          offset: offset,
        },
      },
    });
    const trans = response.data.transactions;
    if (trans) {
      arrLength = trans.length;
      trans.map((tran) => transactions.push(tran));
      offset++;
    } else {
      return { unsettled_total: "0.00", totalTrans: "0" };
    }
  }
  const totalAmount = transactions
    .map((tran) => tran.settleAmount)
    .reduce((curr, accum) => parseFloat(curr) + parseFloat(accum));

  return {
    unsettled_total: parseFloat(totalAmount).toFixed(2),
    totalTrans: transactions.length,
  };
};

////////////////////////// Customers /////////////////////////////////////
////////////////////////// Customers /////////////////////////////////////
////////////////////////// Customers /////////////////////////////////////
export const createCustomerWPayment = async (body) => {
  const { description, email, first, last, company, street, city, state, zip } =
    body;
  try {
    const response = await axios.post(baseUrl, {
      createCustomerProfileRequest: {
        merchantAuthentication: authentication,
        profile: {
          description: description.value,
          email: email.value,
          paymentProfiles: {
            customerType: "individual",
            billTo: {
              firstName: first.value,
              lastName: last.value,
              company: company.value,
              address: street.value,
              city: city.value,
              state: state.value,
              zip: zip.value,
              country: "US",
            },
            payment: {
              creditCard: {
                cardNumber: "4111111111111111",
                expirationDate: "2025-12",
              },
            },
          },
        },
        validationMode: "testMode",
      },
    });

    return response.data;
  } catch (e) {
    return [
      {
        error:
          "Failed to create customer, server error, please contact support",
      },
    ];
  }
};

export const getCustomerProfile = async (id) => {
  const response = await axios.post(baseUrl, {
    getCustomerProfileRequest: {
      merchantAuthentication: authentication,
      customerProfileId: id,
      includeIssuerInfo: "true",
    },
  });

  return response.data;
};

export const getCustomers = async (body) => {
  const customerIds = await axios.post(baseUrl, {
    getCustomerProfileIdsRequest: {
      merchantAuthentication: authentication,
    },
  });

  if (
    customerIds.data.messages.resultCode &&
    customerIds.data.messages.resultCode === "Ok"
  ) {
    const ids = customerIds.data.ids;
    let profiles = await Promise.all(
      ids.map(async (id) => {
        const response = await getCustomerProfile(id);
        return response;
      })
    );
    return profiles;
  } else {
    return ["Internal server error, please contact support"];
  }
};

export const searchCustomerByName = () => {};

export const chargeACustomer = async (body) => {
  const response = await getCustomerProfile(body.id);
  const charge = await axios.post(baseUrl, {
    createTransactionRequest: {
      merchantAuthentication: authentication,
      transactionRequest: {
        transactionType: "authCaptureTransaction",
        amount: body.amount,
        profile: {
          customerProfileId: body.id,
          paymentProfile: {
            paymentProfileId:
              response.profile.paymentProfiles[0].customerPaymentProfileId,
          },
        },
      },
    },
  });
  return charge.data;
};
