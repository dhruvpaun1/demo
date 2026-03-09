import { errorResponse, successResponse } from "../../apiResponse.js"
import { InvoiceModel } from "../../models/Invoice.js"
import { Payments } from "../../models/Payments.js"

export const changeInvoiceStatus=async(req,res)=>{
	try {
		const {newStatus,invoiceId,type,paymentStatus}=req.body
		const newInvoice=await InvoiceModel.update({
			status:newStatus
		},{
			where:{
				id:invoiceId
			},
		})
		if(!newInvoice || newInvoice.length===0)
		{
			return errorResponse(res,"Error in changing invoice status")
		}
		const modifyPayment=await Payments.update({
			type,
			paidAt:(paymentStatus==="SUCCESS"?new Date():null),
			paymentStatus
		},
	{
		where:{
			invoiceId
		}
	})
	const payment=await Payments.findOne({
		where:{
			invoiceId
		}
	})
		return successResponse(res,"Status changed successfully",payment,200)
	} catch (error) {
		return errorResponse(res,"Server Error",500)
	}
}