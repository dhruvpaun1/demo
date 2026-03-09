import {errorResponse, successResponse} from "../../apiResponse.js";
import {Notification} from "../../models/Notification.js";

export const getNotificationCount = async (req, res) => {
	try {
		const userId = req.user.id;
		const notificationCount = await Notification.count({
			where: {
				userId,
				status: "unread",
			},
		});
		return successResponse(res, "notification count fetched successfully", notificationCount, 200);
	} catch (error) {
		return errorResponse(res, "error in fetching count of notification", 500);
	}
};
