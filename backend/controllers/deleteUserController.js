import { errorResponse, successResponse } from "../apiResponse.js";
import { Packages } from "../models/Packages.js";
import { User } from "../models/User.js";
export const deleteUserController=async (req, res) => {
	try {
		const userId = req.params.id;
		const doesUserHasAnyPackages = await Packages.count({
			where: {
				userId,
			},
		});
		if(doesUserHasAnyPackages!==0)
		{
			const deletePackages=await Packages.destroy({
				where:{
					userId
				}
			})
		}
		const deleteUser=await User.destroy({
				where:{
					id:userId
				}
			})
		
		successResponse(res,"User and their packages deleted",{},200)
	} catch (error) {
		errorResponse(res,"Error in deleting user",500)
	}
}