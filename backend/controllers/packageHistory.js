import { errorResponse, successResponse } from "../apiResponse.js"
import { PackageStatusHistory } from "../models/PackageStatusHistory.js"
import { User } from "../models/User.js"

export const packageHistory=async (req,res)=>{
	try {
		const {packageId}=req.body
		const packageStatusHistory=await PackageStatusHistory.findAll({
			where:{
				packageId
			},include:{
				model:User,
			}
		})

		if(packageStatusHistory[0]===0)
		{
			return errorResponse(res,"No Package status history Available",404)
		}
		return successResponse(res,"Package status change history fetched successfully",packageStatusHistory,200)
	} catch (error) {
		return errorResponse(res,"Error in getting packag change status history",500)
	}
}