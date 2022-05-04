import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

export const baseUrl = "https://apitest.authorize.net/xml/v1/request.api";

export const authentication = {
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
        : "Other";
    const newTranObj = {
      ...trans,
      submitTimeLocal: `${newDate + " " + newTime}`,
      transactionStatus: newStatus,
    };
    return newTranObj;
  });
  return frontEndTransactions;
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
  console.log(body);
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
    const batch = response.data.batchList[0];
    const data = await getBatch(batch.batchId, body.offset);
    return formatTransactions(data.transactions);
  }
};
