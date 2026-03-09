import { errorResponse, successResponse } from "../apiResponse.js";
import { InvoiceModel } from "../models/Invoice.js";
import { Packages } from "../models/Packages.js";
import { User } from "../models/User.js";

export const viewPackagesController=async (req, res) => {
	const allPackages = await Packages.findAll({
		include:[
			{model:User},
			{model:InvoiceModel,as:"invoice",required:false}
		],
	});
	 const formatted = allPackages.map(pkg => {
      const data = pkg.toJSON();

      return {
        ...data,
        invoiceCreated: data.invoice ? true : false
      };
    });
	if (!allPackages) {
		return errorResponse(res,"Error in viewing package history",500)
	}
	return successResponse(res,"History fetched successfully",formatted,200)
}