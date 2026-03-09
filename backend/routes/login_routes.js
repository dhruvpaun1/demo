import {Router} from "express";
import {loginController} from "../controllers/loginController.js";
export const loginRoute = Router();
loginRoute.post("/login", loginController);
