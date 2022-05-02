import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const baseUrl = "https://apitest.authorize.net/xml/v1/request.api";

const authentication = {
  name: process.env.AUTH_NET_NAME,
  transactionKey: process.env.AUTH_NET_KEY,
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
