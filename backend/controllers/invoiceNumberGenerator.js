import { sequelize } from "../dbConnection.js"
import { InvoiceModel } from "../models/Invoice.js"

export const generateInvoiceNumber=async()=>{
	const invoiceNumber=await sequelize.transaction(async (t)=>{
		const prevInvoice=await InvoiceModel.findOne({
			order:[["id","DESC"]],
			lock:t.LOCK.UPDATE,
			transaction:t
		})
		let next=1
		if(prevInvoice)
		{
			next=parseInt(prevInvoice.invoiceNumber.split('-')[1],10)+1
		}
		return `INV-${next}`
	})
	return invoiceNumber
}