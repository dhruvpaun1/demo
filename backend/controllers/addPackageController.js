import {errorResponse, successResponse} from "../apiResponse.js";
import { sequelize } from "../dbConnection.js";
import {Packages} from "../models/Packages.js";
import {User} from "../models/User.js";

export const addPackageController = async (req, res) => {
	const t=await sequelize.transaction()
	try {
		const {user_id, tracking_number, weight, item_cost, note, status} = req.body;
		const attachmentPath=req.file?`/uploads/${req.file.filename}`:null
		const user = await User.findOne({
			where: {
				id: user_id,
			},
			transaction:t
		});
		console.log(req.body);
		
		if (!user) errorResponse(res, "No user found", 404);
		if (user.status !== "active") {
			errorResponse(res, "User is inactive cannot assign package", 400);
		}
		const newPackage = await Packages.create({
			userId:user.id,
			trackingNumber: tracking_number,
			weight,
			itemCost: item_cost,
			note,
			attachment:attachmentPath,
			status,
		},{
			transaction:t
		});
		if (!newPackage) {
			errorResponse(res, "Error occured", 500);
		}
		await t.commit()
		successResponse(res, "Package added successfully", {}, 201);
	} catch (error) {
		console.log(error);
		await t.rollback()
		errorResponse(res, error.message, 500);
	}
};
