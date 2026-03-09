import {Router} from "express";
import {profileController} from "../controllers/profileController.js";

export const profileRouter = Router();

profileRouter.get("/my-profile", profileController);
