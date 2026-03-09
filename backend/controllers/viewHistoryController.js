import { errorResponse, successResponse } from "../apiResponse.js";
import { Packages } from "../models/Packages.js";
import { PackageStatusHistory } from "../models/PackageStatusHistory.js";
import { User } from "../models/User.js";

export const viewHistoryController=async (req, res) => {
	const packagesHistory = await PackageStatusHistory.findAll({
		include:[
			{model:User},
			{model:Packages}
		]
	});
	console.log(packagesHistory);
	
	if (!packagesHistory) {
		errorResponse(res, "Error in viewing package history",500)
	}
	successResponse(res,"History fetched successfully",packagesHistory,200)
}