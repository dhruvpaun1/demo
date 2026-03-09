import {Router} from "express";
import {dashboardController} from "../controllers/dashboardController.js";
import { getCustomData } from "../controllers/getCustomDateData.js";
export const dashboardRoute = Router();
dashboardRoute.get("/dashboard", dashboardController);
dashboardRoute.get("/get-custom-data", getCustomData);
