import axios from "axios";
import {
  generateTransaction,
  refundTransaction,
  voidTransaction,
  getTransaction,
  searchTransactions,
} from "../util.js";

export const createRandomTrans = async (req, res) => {
  const response = await generateTransaction();
  return res.json(response);
};

export const transactionSearch = async (req, res) => {
  const response = await searchTransactions(req.body);
  return res.json(response);
};

export const transactionRefund = async (req, res) => {
  const body = req.body;
  const response = await refundTransaction(body);
  return res.json(response);
};

export const transactionVoid = async (req, res) => {
  const { id } = req.params;
  const response = await voidTransaction(id);
  return res.json(response);
};

export const getTransactionDetails = async (req, res) => {
  const { id } = req.params;
  const response = await getTransaction(id);
  if (response) {
    return res.json(response);
  }
  return "Error";
};
