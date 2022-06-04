import { last7Totals } from "../util.js"

export const last7DayTotals = async (req, res) => {
  const response = await last7Totals();
  return res.json(response);
}