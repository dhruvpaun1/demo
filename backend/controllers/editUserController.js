import { errorResponse, successResponse } from "../apiResponse.js";
import { User } from "../models/User.js";

export const editUserController=async (req, res) => {
	try {
		const userId = req.params.id;
		const [name, email, status,dob] = req.body;
		const updatedUser = await User.update(
			{
				name,
				email,
				status,
				dateOfBirth:dob
			},
			{
				where: {
					id: userId,
				},
			},
		);
		if (!updatedUser) {
			errorResponse(res,"Error in updating user",500)
		}
		successResponse(res,"User updated successfully",{},200)
	} catch (error) {
		errorResponse(res,"Error in editing user",500)
	}
}