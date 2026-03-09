import {errorResponse, successResponse} from "../../apiResponse.js";
import {Packages} from "../../models/Packages.js";

export const scheduleDelivery = async (req, res) => {
	try {
		const {address, receiverName, packageId} = req.body;
		const packages = await Packages.findByPk(packageId);
		if (!packages) {
			return errorResponse(res, "Could not find package", 404);
		}
		packages.deliveryDetails = {address, receiverName};
		await packages.save();
		return successResponse(res, "address added and delivery schedules successfully", {}, 200);
	} catch (error) {
		return errorResponse(res, "Error in scheduling delivery", 500);
	}
};
