'use strict';

import { InvoiceModel } from '../models/Invoice.js';
import { Packages } from '../models/Packages.js';
import { User } from '../models/User.js';

/** @type {import('sequelize-cli').Seeder} */
export async function up(queryInterface, Sequelize) {
	const prevInvoice=await InvoiceModel.findOne({
		attributes:["invoiceNumber"],
		order:[["id","desc"]]
	})
	let nextInvoiceNumber=1;
	if(prevInvoice)
	{
		const prevNumber=parseInt(prevInvoice.invoiceNumber.split('-')[1],10)
		nextInvoiceNumber=prevNumber+nextInvoiceNumber
	}
	const deliveredPackageId=await Packages.findOne({
		where:{
			status:"Delivered"
		}
	})
	if(!deliveredPackageId)
	{
		throw new Error("Package does not exist")
	}
	const adminId=await User.findOne({
		where:{
			role:"admin"
		},
		attributes:["id"]
	})
	if(!adminId || !adminId.id)
	{
		throw new Error("Could not find admin")
	}
	const newInvoiceNumber = `INV-${nextInvoiceNumber}`
	await queryInterface.bulkInsert("invoices",[{
		invoice_number:newInvoiceNumber,
		package_id:deliveredPackageId.id,
		tracking_number:deliveredPackageId.trackingNumber,
		total_weight:deliveredPackageId.weight,
		total_cost:deliveredPackageId.itemCost,
		invoice_created_by:adminId.id,
		created_at: new Date()
	}])
}
export async function down(queryInterface, Sequelize) {
	await queryInterface.bulkDelete("invoices")
}
