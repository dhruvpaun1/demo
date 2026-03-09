import { errorResponse, successResponse } from "../apiResponse.js"
import { Packages } from "../models/Packages.js"
import { PackageQueries } from "../models/PackagesQueries.js"
import { User } from "../models/User.js"

export const viewQueries=async (req,res)=>{
	try {
		const role=req.user.role
		const id=req.user.id
		if(role==="admin")
		{
			const packageQueries=await PackageQueries.findAll({
				include:[
					{model:User,as:"customer"},
					{model:Packages,as:"package"}
				],
				order:[["createdAt","DESC"]]
			})
			return successResponse(res,"Packages Query fetched successfully",packageQueries,200)
		}else{
			const packageQueries=await PackageQueries.findAll({
				where:{
					userId:id
				}
			})
			return successResponse(res,"Packages Query Fetched success",packageQueries,200)
		}
	} catch (error) {
		return errorResponse(res,"Could not fetch package queries",500)
	}
}