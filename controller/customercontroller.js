import {
  createCustomerWPayment,
  getCustomers,
  getCustomerProfile,
  chargeACustomer,
  deleteCustomerProfile,
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

export const searchCustomers = async (req, res, next) => {
  const { search_type, value } = req.body;
  if (search_type === "id") {
    try {
      const response = await getCustomerProfile(value.trim());
      return res.json([response]);
    } catch (e) {
      return res.json({ error: "Server error" });
    }
  } else {
    try {
      let names = value.split(" ");
      const first = names[0] === undefined ? "firstname" : names[0];
      const last = names[1] === undefined ? "lastname" : names[1];
      console.log(first, last);
      const customers = await getCustomers();
      const matches = customers.filter((cust) => {
        if (
          cust.profile.paymentProfiles[0].billTo.firstName.toLowerCase() ===
            first.toLowerCase().trim() ||
          cust.profile.paymentProfiles[0].billTo.lastName.toLowerCase() ===
            last.toLowerCase().trim()
        ) {
          return cust;
        }
      });
      return res.json(matches);
    } catch (e) {
      console.log(e);
      return res.json({ error: "Server error" });
    }
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

export const chargeAProfile = async (req, res, next) => {
  const response = await chargeACustomer(req.body);
  return res.json(response);
};

export const deleteCustomer = async (req, res, next) => {
  const { id } = req.params;
  const response = await deleteCustomerProfile(id);
  return res.json(response);
};
