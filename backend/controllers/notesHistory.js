import { errorResponse, successResponse } from "../apiResponse.js"
import { QueryMessage } from "../models/QueryMessages.js"

export const notesMessage=async (req,res)=>{
	try {
		const {queryId}=req.params
		console.log("Received queryId:", queryId);
		const getQueryMessageByQueryId=await QueryMessage.findAll({
			where:{
				queryId:queryId
			}
		})
		return successResponse(res,"Message History Fetched successfully",getQueryMessageByQueryId,200)
	} catch (error) {
		console.log(error);
		return errorResponse(res,"Error in getting query messages",500)
	}
}