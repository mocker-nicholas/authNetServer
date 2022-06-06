import { last7Totals, getUnsettledTotal } from "../util.js";

export const last7DayTotals = async (req, res) => {
  const response = await last7Totals();
  return res.json(response);
};

export const unsettledTotal = async (req, res) => {
  const response = await getUnsettledTotal();
  return res.json(response);
};
