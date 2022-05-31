import { getFormToken } from "../util.js";

export const getHostedToken = async (req, res) => {
  const response = await getFormToken(req.body);
  return res.json(response);
};
