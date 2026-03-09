import { Router } from "express";
import { addNewQuery } from "../controllers/addNewQuery.js";
import { customerMessageSender } from "../controllers/customerMessageSender.js";
import { viewQueries } from "../controllers/viewQueries.js";
import { upload } from "../middlewares/fileUploadMiddleware.js";
import { notesMessage } from "../controllers/notesHistory.js";

export const PackageQueryRouterForUser=Router()

PackageQueryRouterForUser.post('/add-query',upload.single("attachment"),addNewQuery)
PackageQueryRouterForUser.post("/customer-respond",customerMessageSender)
PackageQueryRouterForUser.get("/view-all-queries",viewQueries)
PackageQueryRouterForUser.get("/view-query-message/:queryId",notesMessage)
