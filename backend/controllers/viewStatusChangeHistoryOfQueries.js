import { errorResponse, successResponse } from "../apiResponse.js"
import { QueryStatusHistory } from "../models/QueryStatusHistory.js"
import { User } from "../models/User.js"
export const viewStatusChangeHistoryOfQueries=async (req,res)=>{
	try {
		const {queryId}=req.body
		const packageQueryStatusHistory=await QueryStatusHistory.findAll({
			where:{
				queryId
			},include:
				{model:User,as:"changedByUser"}
		})
		if(packageQueryStatusHistory.length===0)
		{
			return errorResponse(res,"Package query status history is empty",404)
		}
		await successResponse(res,"Package query status history fetched successfully",packageQueryStatusHistory,200)
	} catch (error) {
		console.log(error);
		await errorResponse(res,"Error in viewing package query status change history",500)
	}
}