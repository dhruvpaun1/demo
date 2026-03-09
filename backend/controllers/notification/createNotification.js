import { Notification } from "../../models/Notification.js";
import { io } from "../../index.js";

export const createNotification = async (
  sendBy,
  userId,
  message,
  type,
  status = "unread"
) => {
  const newNotification = await Notification.create({
    sendBy,
    userId,
    message,
    typeOfNotification: type,
    status,
  });

  io.to(`user_${userId}`).emit("newNotification", newNotification);

  return { success: true };
};
