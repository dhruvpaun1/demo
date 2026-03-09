import {Router} from "express";
import {getNotificationCount} from "../controllers/notification/getNotificationCount.js";
import { getAllNotifications } from "../controllers/notification/getAllNotifications.js";
import { markAsRead } from "../controllers/notification/markAsRead.js";
import { markAsUnread } from "../controllers/notification/markAsUnread.js";

export const notificationRouter = Router();

notificationRouter.get("/get-count", getNotificationCount);
notificationRouter.get("/all-notification",getAllNotifications)
notificationRouter.put("/mark-as-read/:id",markAsRead)
notificationRouter.put("/mark-as-unread/:id",markAsUnread)
