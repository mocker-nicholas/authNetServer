import {
  createCustomerWPayment,
  getCustomers,
  getCustomerProfile,
} from "../util.js";

export const createCustomer = async (req, res, next) => {
  try {
    const response = await createCustomerWPayment(req.body);
    return res.json(response);
  } catch (e) {
    return res.json({ error: "Internal server error, please contact support" });
  }
};

export const getAllCustomers = async (req, res, next) => {
  try {
    const response = await getCustomers();
    return res.json(response);
  } catch (e) {
    return res.json({ error: "Internal server error, please contact support" });
  }
};

export const getSingleCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await getCustomerProfile(id);

    // Send Error Back
    if (response.messages.resultCode !== "Ok") {
      return res.json({ error: "Resource was not found, please try again" });
    }
    return res.json(response);
  } catch (e) {
    return res.json({ error: "Internal server error, please contact support" });
  }
};
