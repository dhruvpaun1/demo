import {errorResponse, successResponse} from "../apiResponse.js";
import {sequelize} from "../dbConnection.js";
import {PackageQueries} from "../models/PackagesQueries.js";
import {QueryMessage} from "../models/QueryMessages.js";
import {User} from "../models/User.js";
import {createNotification} from "./notification/createNotification.js";
import {statusChanger} from "./statusChanger.js";

export const customerMessageSender = async (req, res) => {
	const transaction = await sequelize.transaction();
	try {
		const {queryId, message} = req.body;
		const attachment = req.file ? `/uploads/${req.file.fileName}` : null;
		const sendBy = req.user.id;
		const query = await PackageQueries.findOne({
			where: {
				id: queryId,
			},
			transaction,
		});
		if (!query) {
			await transaction.rollback();
			return errorResponse(res, "Could not find query", 404);
		}
		if (query.status !== "Respond") {
			await transaction.rollback();
			return errorResponse(res, "You are not allowed to send message", 400);
		}
		query.notes = message;
		await query.save({transaction});
		const newMessage = await QueryMessage.create(
			{
				queryId,
				sendBy,
				senderRole: "user",
				message,
				attachment,
			},
			{
				transaction: transaction,
			},
		);
		const allAdmins = await User.findAll({
			where: {
				role: "admin",
			},
		});
		for (const admin of allAdmins) {
			await createNotification(sendBy, admin.id, "new message from customer", "message");
		}
		await statusChanger("Customer Respond", sendBy, queryId, transaction);
		await transaction.commit();
		successResponse(res, "message send successfully", {}, 200);
	} catch (error) {
		await transaction.rollback();
		errorResponse(res, "error in sending message", 500);
	}
};
