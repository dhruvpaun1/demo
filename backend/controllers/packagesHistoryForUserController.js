import { errorResponse, successResponse } from "../apiResponse.js";
import { Packages } from "../models/Packages.js";
import { PackageStatusHistory } from "../models/PackageStatusHistory.js";

export const packageHistoryForUserController=async (req, res) => {
	try {
		const userId = req.user.id;
		let packageId;
		const packages = await Packages.findAll({
			where: {
				userId,
			},
		});
		if (!packages || packages.length === 0) {
			errorResponse(res,"NO packages found for this user",200)
		}
		packageId = packages.map((pack) => pack.id);
		const packageStatusHistory = await PackageStatusHistory.findAll({
			where: {
				packageId,
			},include:{
				model:Packages
			}
		});
		if (!packageStatusHistory) {
			errorResponse(res,"",404)
		}
		successResponse(res,"Status history fetched successfully",packageStatusHistory,200)
	} catch (error) {
		console.log(error);
		errorResponse(res,"Error in fetching status history",500)
	}
}