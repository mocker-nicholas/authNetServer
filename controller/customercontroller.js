import { createCustomerWPayment } from "../util.js";

export const createCustomer = async (req, res, next) => {
  const response = await createCustomerWPayment(req.body);
  return response;
};
