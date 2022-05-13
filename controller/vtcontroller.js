import axios from "axios";
import { authentication, baseUrl } from "../util.js";

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
