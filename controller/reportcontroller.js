import { last7Totals, getUnsettledTotal, monthsTransactions } from "../util.js";

export const last7DayTotals = async (req, res) => {
  const response = await last7Totals();
  return res.json(response);
};

export const unsettledTotal = async (req, res) => {
  const response = await getUnsettledTotal();
  return res.json(response);
};

export const monthData = async (req, res, next) => {
  const { year, month } = req.body;
  const response = await monthsTransactions(year, month);
  return res.json(response);
};
