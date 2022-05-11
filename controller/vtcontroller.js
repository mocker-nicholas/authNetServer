import axios from "axios";
import { authentication, baseUrl } from "../util.js";

export const getFormToken = async (body) => {
  const response = await axios.post(baseUrl, {
    getHostedPaymentPageRequest: {
      merchantAuthentication: authentication,
      transactionRequest: {
        transactionType: "authCaptureTransaction",
        amount: body.amount,
        billTo: {
          firstName: body.first,
          lastName: body.last,
          company: body.company,
          address: body.street,
          city: body.city,
          state: body.state,
          zip: body.zip,
          country: body.country,
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
            settingValue: '{"bgColor": "blue"}',
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
