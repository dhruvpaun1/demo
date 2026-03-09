import { errorResponse, successResponse } from "../../apiResponse.js"
import { Notification } from "../../models/Notification.js"

export const markAsUnread=async (req,res)=>{
	try {
		const notificationId=req.params.id
		const updateNotification=await Notification.update({
			status:"unread"
		},{
			where:{
				id:notificationId
			}
		})
		if(updateNotification.length===0)
		{
			return errorResponse(res,"Could not find the notification by id",400)
		}
		return successResponse(res,"Notification updated successfully",{},200)
	} catch (error) {
		return errorResponse(res,"Error in updating notification",500)
	}
}