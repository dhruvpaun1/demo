import { errorResponse, successResponse } from "../apiResponse.js"
import { Packages } from "../models/Packages.js"

export const deleteManifestPackagesController=async (req,res)=>{
	try {
		const {packageId}=req.body	
		const packages=await Packages.update({
			manifestId:null
		},{
			where:{
				id:packageId
			}
		})
		if(!packages || packages[0]===0)
		{
			errorResponse(res,"Could not find packages for delete",400)
		}
		successResponse(res,"Packages deleted successfully from Manifest")
	} catch (error) {
		errorResponse(res,"Error in deleting package from manifest",500)
	}
}