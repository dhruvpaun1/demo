import { errorResponse, successResponse } from "../../apiResponse.js"
import { Notification } from "../../models/Notification.js"

export const markAsRead=async (req,res)=>{
	try {
		const id=req.params.id
		const updateNotification=await Notification.update({
			status:"read"
		},{
			where:{
				id
			}
		})
		if(updateNotification.length===0)
		{
			return errorResponse(res,"Error in updating notification status",400)
		}
		return successResponse(res,"notification updated successfully",{},200)
	} catch (error) {
		console.log(error);
		
		return errorResponse(res,"Server Error in updating notification",500)
	}
}