import {errorResponse, successResponse} from "../../apiResponse.js";
import {InvoiceModel} from "../../models/Invoice.js";
import {Packages} from "../../models/Packages.js";
import {PackageStatusHistory} from "../../models/PackageStatusHistory.js";
import {Payments} from "../../models/Payments.js";
import {stripe} from "./paymentIntentController.js";

export const paymentSuccessControler = async (req, res) => {
	const {paymentIntentId, invoiceId} = req.body;
	try {
		const session = await stripe.paymentIntents.retrieve(paymentIntentId);

		if (session.status === "succeeded") {
			await InvoiceModel.update({status: "PAID"}, {where: {id: invoiceId}});
			const invoice =await InvoiceModel.findByPk(invoiceId)
			console.log(invoice);
			
			await Payments.update(
				{
					paymentStatus: "SUCCESS",
					transactionId: session.id,
					amount: session.amount / 100,
					paidAt: new Date(),
					userId: req.user.id,
					type: "ONLINE",
					gatewayResponse: JSON.stringify(session),
				},
				{
					where: {
						invoiceId,
					},
				},
			);
			const packages=await Packages.findOne({
				where:{
					id:invoice.packageId
				}
			})
			const oldStatus=packages.status
			packages.status="Ready for Dispatch"
			packages.save()
			// const packages = await Packages.update(
			// 	{
			// 		status: "Ready for Dispatch",
			// 	},
			// 	{
			// 		where: {
			// 			id: invoice.packageId
			// 		},
			// 	},
			// );
			await PackageStatusHistory.create({
				packageId: packages.id,
				oldStatus,
				newStatus: packages.status,
				changedBy: req.user.id,
			});
			return successResponse(res, "Payment Updated successfully", {}, 200);
		}

		return errorResponse(res, "could not verify payment", 400);
	} catch (error) {
		console.log(error);
		
		return errorResponse(res, error.message, 500);
	}
};
