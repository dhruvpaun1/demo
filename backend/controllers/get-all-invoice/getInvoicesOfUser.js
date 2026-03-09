import { errorResponse, successResponse } from "../../apiResponse.js"
import { InvoiceModel } from "../../models/Invoice.js"
import { Packages } from "../../models/Packages.js"

export const getInvoicesOfUser=async (req,res)=>{
	const id=req.user.id
	try {
		const invoices=await InvoiceModel.findAll({
			include:{
				model:Packages,
				as:"package",
				where:{
					userId:id
				}
			},
			order:[["created_at","DESC"]]
		})
		if(!invoices)
		{
			return errorResponse(res,"No invoice available",404)
		}
		return successResponse(res,"Invoices fetched successfully",invoices,200)
	} catch (error) {
		console.log(error);
		return errorResponse(res,"Error in fetching invoices",500)
	}
}