import {errorResponse, successResponse} from "../apiResponse.js";
import {sequelize} from "../dbConnection.js";
import {PackageQueries} from "../models/PackagesQueries.js";
import {QueryMessage} from "../models/QueryMessages.js";
import {createNotification} from "./notification/createNotification.js";
import {statusChanger} from "./statusChanger.js";
export const adminMessageSend = async (req, res) => {
	const transaction = await sequelize.transaction();
	try {
		const {queryId, message} = req.body;
		const sendBy = req.user.id;
		const senderRole = req.user.role;
		const attachmentPath = req.file ? `/uploads/${req.file.filename}` : null;
		const query = await PackageQueries.findOne({
			where: {
				id: queryId,
			},
			transaction,
		});
		if (!query) {
			await transaction.rollback();
			return errorResponse(res, "could not find query", 404);
		}
		if (query.status === "Resolved") {
			await transaction.rollback();
			return errorResponse(res, "packages is already resolved");
		}
		query.notes = message;
		await query.save({transaction});
		await statusChanger("Respond", sendBy, queryId, transaction);
		const newMessage = await QueryMessage.create(
			{
				queryId,
				sendBy,
				senderRole,
				message,
				attachment: attachmentPath,
			},
			{
				transaction,
			},
		);
		await createNotification(req.user.id, query.userId, "You have new message from admin check it out", "message");
		await transaction.commit();
		return successResponse(res, "Message sended successfully", {}, 201);
	} catch (error) {
		console.log(error);
		await transaction.rollback();
		return errorResponse(res, "Error in sending message", 500);
	}
};
