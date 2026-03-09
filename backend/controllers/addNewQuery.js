import {errorResponse, successResponse} from "../apiResponse.js";
import {sequelize} from "../dbConnection.js";
import {PackageQueries} from "../models/PackagesQueries.js";
import {QueryMessage} from "../models/QueryMessages.js";
import {User} from "../models/User.js";
import {createNotification} from "./notification/createNotification.js";
export const addNewQuery = async (req, res) => {
	const trans = await sequelize.transaction();
	try {
		const {packageId, notes} = req.body;
		const userId = req.user.id;
		console.log("FILE OBJECT:", req.file);

		const attachementPath = req.file ? `/uploads/${req.file.filename}` : null;
		const newQuery = await PackageQueries.create(
			{
				packageId,
				userId,
				attachment: attachementPath,
				notes,
				status: "Submitted",
			},
			{
				transaction: trans,
			},
		);
		const newQueryMessage = await QueryMessage.create(
			{
				queryId: newQuery.id,
				sendBy: userId,
				senderRole: "user",
				message: notes,
				attachment: attachementPath,
			},
			{
				transaction: trans,
			},
		);
		const allAdmins = await User.findAll({
			where: {
				role: "admin",
			},
		});
		for (const admin of allAdmins) {
			await createNotification(userId, admin.id, "new query from user", "new query");
		}
		await trans.commit();
		return successResponse(res, "query reported successfully", {}, 201);
	} catch (error) {
		await trans.rollback();
		console.log(error);

		return errorResponse(res, "Error in adding new query", 500);
	}
};
