import {Router} from "express";
import {scheduleDelivery} from "../controllers/delivery/scheduleDeliveryController.js";

export const deliveryRoute = Router();

deliveryRoute.post("/schedule-delivery", scheduleDelivery);
