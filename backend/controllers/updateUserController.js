import { errorResponse, successResponse } from "../apiResponse.js";
import { User } from "../models/User.js";

export const updateUserController=async (req, res) => {
	const {id} = req.params;
	const {name, email, status,dob} = req.body;
	const updateUser = await User.update(
		{
			name,
			email,
			status,
			dateOfBirth:dob
		},
		{
			where: {
				id,
			},
		},
	);
	if (!updateUser) errorResponse(res,"error in updating user",500)
		successResponse(res,"User updated!",{},200)
}