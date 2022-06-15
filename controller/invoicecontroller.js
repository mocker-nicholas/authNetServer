import { connection } from "../app.js";

export const getAllInvoices = (req, res, next) => {
  connection.query("SELECT * FROM invoices", (error, result, fields) => {
    if (error) {
      return res.json([{ error: `Database Error: ${error}` }]);
    } else {
      return res.json(result);
    }
  });
};

export const getInvoiceById = (req, res, next) => {
  const { id } = req.params;
  connection.query(
    `SELECT * FROM invoices WHERE invoice_number = ${id} `,
    (error, result, fields) => {
      if (error) {
        return res.json([{ error: `Database Error: ${error}` }]);
      } else {
        res.json(result);
      }
    }
  );
};
