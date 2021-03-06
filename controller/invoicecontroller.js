import { connection } from "../app.js";
import { randId, Invoice } from "../util.js";

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
        return res.json(result);
      }
    }
  );
};

export const createInvoice = (req, res, next) => {
  const { address, city, state, zip, first, last, description, paid, amount } =
    req.body;
  let invoice_number = randId();
  let invoice = new Invoice(
    invoice_number,
    address,
    city,
    state,
    zip,
    first,
    last,
    description,
    paid,
    amount
  );
  let sql = "INSERT INTO invoices SET ?";

  connection.query(sql, { ...invoice }, (error, result, fields) => {
    if (error) {
      return res.json([{ error: `Database Error: ${error}` }]);
    } else {
      return res.json({
        message: "Your Invoice has been created",
        invoice_number: invoice_number,
      });
    }
  });
};

export const deleteInvoice = (req, res, next) => {
  const { id } = req.params;
  connection.query(
    `DELETE FROM invoices WHERE invoice_number = ${id} `,
    (error, result, fields) => {
      if (error || result.affectedRows === 0) {
        return res.json([
          {
            error: `Database Error: There was a problem deleting your invoice`,
          },
        ]);
      } else {
        return res.json([{ success: `invoice ${id} has been deleted` }]);
      }
    }
  );
};

export const markInvoiceAsPaid = (req, res, next) => {
  const { id } = req.params;
  connection.query(
    `UPDATE invoices SET paid = 1 WHERE invoice_number = ${id}`,
    (error, result, fields) => {
      return;
    }
  );
};
