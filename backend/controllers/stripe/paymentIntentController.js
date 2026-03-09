import {InvoiceModel} from "../../models/Invoice.js";
import Stripe from "stripe";
import {errorResponse, successResponse} from "../../apiResponse.js";
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const paymentIntentController = async (req, res) => {
	const {invoiceId, amount} = req.body;
	try {
		const invoice = await InvoiceModel.findByPk(parseInt(invoiceId));
		const paymentIntent = await stripe.paymentIntents.create({
			amount: (invoice.packageCost+invoice.deliveryCost) * 100,
			currency: "usd",
			metadata: {
				invoiceNumber: invoice.invoiceNumber,
			},
		});
		const responseData = {
			clientSecret: paymentIntent.client_secret,
			invoice: {
				number: invoice.invoiceNumber,
				amount: (invoice.packageCost)+(invoice.deliveryCost),
			},
		};
		return successResponse(res, "Payment intent created successfully", responseData, 200);
	} catch (error) {
		console.log(error);
		return errorResponse(res, "Error in creating payment intent", 500);
	}
};
