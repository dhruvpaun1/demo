import {Router} from "express";
import {viewPackagesForUser} from "../controllers/viewPackagesForUser.js";
import {packageHistoryForUserController} from "../controllers/packagesHistoryForUserController.js";

export const packageHistoryForUser = Router();
packageHistoryForUser.get("/view-packages", viewPackagesForUser);
packageHistoryForUser.get("/", packageHistoryForUserController);
