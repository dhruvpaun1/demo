import { errorResponse, successResponse } from "../apiResponse.js"
import { Manifest } from "../models/Manifests.js"

export const deleteManifestController=async(req,res)=>{
	try {
		const {manifestId}=req.body	
		const manifestToBeDeleted=await Manifest.destroy({
			where:{
				id:manifestId
			}
		})
		if(!manifestToBeDeleted || manifestToBeDeleted[0]===0)
		{
			errorResponse(res,"Could not delete manifest",400)
		}
		successResponse(res,"Manifest deleted successfully",{},200)
	} catch (error) {
		errorResponse(res,"Error in deleting manifest",500)
	}
}