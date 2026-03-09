import { errorResponse, successResponse } from "../apiResponse.js";
import { User } from "../models/User.js";

export const allUserController=async (req, res) => {
	try {
		const allUsers = await User.findAll({
			where: {
				role: "user",
			},
		});
		if (!allUsers) {
			errorResponse(res,"Error occured in fetcing users",400)
		}
		successResponse(res,"User fetched successfully",allUsers,200)
	} catch (error) {
		errorResponse(res,"Error in deleting user",500)
	}
}