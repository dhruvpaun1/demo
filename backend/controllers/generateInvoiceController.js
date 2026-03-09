import {errorResponse, successResponse} from "../apiResponse.js";
import {InvoiceModel} from "../models/Invoice.js";
import {Packages} from "../models/Packages.js";
import {Payments} from "../models/Payments.js";
import {generateInvoiceNumber} from "./invoiceNumberGenerator.js";

export const generateInvoiceController = async (req, res) => {
	try {
		const {packageId} = req.body;
		const invoiceNumber = await generateInvoiceNumber();
		const invoiceCreatedBy = req.user.id;
		const adminName = req.user.username;
		const packages = await Packages.findOne({
			where: {
				id: packageId,
			},
		});
		const isInvoiceAlreadyExist = await InvoiceModel.findOne({
			where: {
				packageId,
			},
		});
		if (isInvoiceAlreadyExist) {
			return successResponse(res,"Invoice fetched successfully",isInvoiceAlreadyExist,200)
		}
		const newInvoice = await InvoiceModel.create({
			invoiceNumber,
			packageId,
			trackingNumber: packages.trackingNumber,
			packageCost: packages.itemCost,
			totalWeight: packages.weight,
			invoiceCreatedBy,
		});
		const invoiceData = newInvoice.get({plain: true});
		const payment = Payments.create({
			userId: packages.userId,
			amount: newInvoice.packageCost+newInvoice.deliveryCost,
			invoiceId: newInvoice.id,
		});
		if (!newInvoice) {
			return errorResponse(res, "Error in creating new Invoice", 400);
		}
		if (!payment) {
			return errorResponse(res, "Could not create a payment", 400);
		}
		return successResponse(res, "Invoice Created successfully", {...invoiceData, adminName}, 200);
	} catch (error) {
		console.log(error);

		return errorResponse(res, "error in generating invoice", 500);
	}
};
