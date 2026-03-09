import { Op } from "sequelize"
import { Packages } from "../../models/Packages.js"
import { errorResponse, successResponse } from "../../apiResponse.js"
import { InvoiceModel } from "../../models/Invoice.js"

export const getAllScheduledDelivery=async (req,res)=>{
	try {
		const packages=await Packages.findAll({
			where:{
				delivery_details:{
					[Op.not]:null
				}
			},
			order: [['created_at', 'DESC']],
			include:{
				model:InvoiceModel,
				foreignKey:"package_id",
				as:"invoice"
			}
		})
		return successResponse(res,"Scheduled Packages fetched successfully",packages,200)
	} catch (error) {
		console.log(error);
		
		return errorResponse(res,"Error in fetching scheduled packages",500)
	}
}