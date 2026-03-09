import { errorResponse, successResponse } from "../../apiResponse.js"
import { Notification } from "../../models/Notification.js"

export const getAllNotifications=async (req,res)=>{
	const userId=req.user.id
	try {
		const notifications=await Notification.findAll({
			where:{
				userId
			},order:[["createdAt","DESC"]]
		})
		if(!notifications || notifications.length===0)
		{
			return errorResponse(res,"No notification to show",404)
		}
		return successResponse(res,"notifications fetched successfully",notifications,200)
	} catch (error) {
		return errorResponse(res,"Error in fetching notifications history",500)
	}
}