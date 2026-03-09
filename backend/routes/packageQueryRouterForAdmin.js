import { Router } from "express";
import { adminMessageSend } from "../controllers/adminMessageSender.js";
import { changeQueryStatus } from "../controllers/changeQueryStatus.js";
import { viewQueries } from "../controllers/viewQueries.js";
import { viewStatusChangeHistoryOfQueries } from "../controllers/viewStatusChangeHistoryOfQueries.js";
import { notesMessage } from "../controllers/notesHistory.js";

export const packageQueryRouterForAdmin=Router()

packageQueryRouterForAdmin.post("/send-respond",adminMessageSend)
packageQueryRouterForAdmin.put("/changeQueryStatus",changeQueryStatus)
packageQueryRouterForAdmin.get("/view-all-queries",viewQueries)
packageQueryRouterForAdmin.post("/view-queries-history",viewStatusChangeHistoryOfQueries)
packageQueryRouterForAdmin.get("/view-query-messages/:queryId",notesMessage)