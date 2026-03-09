import Router from "express";
import {addPackageController} from "../controllers/addPackageController.js";
import {editPackageController} from "../controllers/editPackageController.js";
import {viewHistoryController} from "../controllers/viewHistoryController.js";
import {viewPackagesController} from "../controllers/viewPackagesController.js";
import { upload } from "../middlewares/fileUploadMiddleware.js";
import { packageHistory } from "../controllers/packageHistory.js";
export const packageAddRoute = Router();

packageAddRoute.post("/add-package",upload.single("attachment"), addPackageController);
packageAddRoute.put("/edit-status/:id", editPackageController);
packageAddRoute.get("/view-history", viewHistoryController);
packageAddRoute.get("/view-packages", viewPackagesController);
packageAddRoute.post("/view-package", packageHistory);
