import { errorResponse, successResponse } from "../apiResponse.js";
import { User } from "../models/User.js";

export const profileController=async (req, res) => {
	try {
		const userId = req.user.id;
		const user = await User.findAll({
			where: {
				id: userId,
			},
		});
		if (!user) {
			errorResponse(res,"Could not fetch user",500)
		}
		successResponse(res,"Profile details fetched successfully",user,200)
	} catch (error) {
		errorResponse(res,"Something went wrong",500)
	}
}