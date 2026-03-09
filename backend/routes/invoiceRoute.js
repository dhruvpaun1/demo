import { Router } from "express";
import { generateInvoiceController } from "../controllers/generateInvoiceController.js";
import { viewAllInvoices } from "../controllers/viewAllInvoices.js";
import { changeInvoiceStatus } from "../controllers/get-all-invoice/changeInvoiceStatus.js";

export const invoiceRoute=Router()

invoiceRoute.post("/create-invoice",generateInvoiceController)
invoiceRoute.get("/view-invoices",viewAllInvoices)
invoiceRoute.put("/change-status",changeInvoiceStatus)