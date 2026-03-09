import { errorResponse, successResponse } from "../apiResponse.js";
import { InvoiceModel } from "../models/Invoice.js";
import { Payments } from "../models/Payments.js";
export const viewAllInvoices=async(req,res)=>{
	try {
		const userId=req.user.id
		const allInvoices=await InvoiceModel.findAll({
			where:{
				invoiceCreatedBy:userId
			},
			include:{
				model:Payments,
				foreignKey:"invoice_id"
			},
			order:[["created_at","DESC"]]
		})
		if(allInvoices.length===0)
		{
			errorResponse(res,"No Invoice Found",404)
		}
		successResponse(res,"Invoice History fetched successfully",allInvoices,200)
	} catch (error) {
		console.log(error);
		errorResponse(res,"Error in viewing all invoices",500)
	}
}