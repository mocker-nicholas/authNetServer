import fetch, { Headers } from "node-fetch";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

// Set Headers for iQ Pro requests
export const headers = new Headers();
headers.append("Content-Type", "application/json");
headers.append("authorization", process.env.iQ_PRO_KEY);

export const getTransactions = async (offset) => {
  const yesterday =
    new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 19) + "Z";

  const today = new Date().toISOString().slice(0, 19) + "Z";

  const response = await fetch(
    "https://sandbox.basysiqpro.com/api/transaction/search",
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        created_at: {
          start_date: yesterday,
          end_date: today,
        },
        limit: 20,
        offset: parseInt(offset),
      }),
    }
  );
  const data = await response.json();
  return data;
};

export const getSingleTransaction = async (id) => {
  const response = await fetch(
    `https://sandbox.basysiqpro.com/api/transaction/${id}`,
    {
      method: "GET",
      headers: headers,
    }
  );
  const data = await response.json();
  return data;
};
