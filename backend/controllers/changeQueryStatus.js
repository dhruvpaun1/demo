import {sequelize} from "../dbConnection.js";
import {PackageQueries} from "../models/PackagesQueries.js";
import {QueryStatusHistory} from "../models/QueryStatusHistory.js";
import {successResponse, errorResponse} from "../apiResponse.js";
import {createNotification} from "./notification/createNotification.js";
export const changeQueryStatus = async (req, res) => {
	try {
		const {queryId, newStatus} = req.body;
		const changedBy = req.user.id;
		const oldQuery = await PackageQueries.findOne({
			where: {
				id: queryId,
			},
		});
		const oldStatus = oldQuery.status;
		if (oldStatus === newStatus) {
			return errorResponse(res, "Could not assign same status", 400);
		}
		oldQuery.status = newStatus;
		await oldQuery.save();
		const newQueryStatusHistory = await QueryStatusHistory.create({
			queryId,
			oldStatus,
			newStatus,
			changedBy,
		});
		await createNotification(changedBy, oldQuery.userId, "Your query status has been changed", "status change");
		successResponse(res, "Status changed and history updated successfully", {}, 200);
	} catch (error) {
		console.log(error);

		errorResponse(res, "Error in changing status or in storing history of status", 500);
	}
};
