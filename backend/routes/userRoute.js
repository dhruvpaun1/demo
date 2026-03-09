import {Router} from "express";
import {addUserController} from "../controllers/addUserController.js";
import {updateUserController} from "../controllers/updateUserController.js";
import {allUserController} from "../controllers/allUsersController.js";
import {editUserController} from "../controllers/editUserController.js";
import {deleteUserController} from "../controllers/deleteUserController.js";
import { getLast6MonthsUsers } from "../controllers/get6MonthsCustomerData.js";
export const userRoute = Router();

userRoute.post("/add-user", addUserController);
userRoute.put("/update-user/:id", updateUserController);
userRoute.get("/all-users", allUserController);
userRoute.put("/edit-user/:id", editUserController);
userRoute.get("/data-last-6-months",getLast6MonthsUsers)

userRoute.delete("/delete-user/:id", deleteUserController);
