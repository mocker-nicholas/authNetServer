import {
  createCustomerWPayment,
  getCustomers,
  getCustomerProfile,
} from "../util.js";

export const createCustomer = async (req, res, next) => {
  const response = await createCustomerWPayment(req.body);
  return res.json(response);
};

export const getAllCustomers = async (req, res, next) => {
  const response = await getCustomers();
  return res.json(response);
};

export const getSingleCustomer = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  const response = await getCustomerProfile(id);
  return res.json(response);
};
