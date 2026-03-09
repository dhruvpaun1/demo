import { Router } from "express";
import { getInvoicesOfUser } from "../controllers/get-all-invoice/getInvoicesOfUser.js";

export const invoiceRouteForUser=Router()

invoiceRouteForUser.get("/get-invoice-of-user",getInvoicesOfUser)