import { errorResponse, successResponse } from "../apiResponse.js";
import { Packages } from "../models/Packages.js";
import {User} from "../models/User.js"
export const viewPackagesForUser=async (req, res) => {
	console.log(req.user);
	const userId = req.user.id;
	const packages = await Packages.findAll({
		where: {
			userId,
		},
		include:{
			model:User,
			foreignKey:"user_id"
		}
	});
	if (!packages) {
		return errorResponse(res,"could not find packages history",500)
	}
	return successResponse(res,"Packages fetched successfully",packages,200)
}