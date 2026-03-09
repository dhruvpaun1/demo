'use strict';

import { sequelize } from '../dbConnection';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
	await queryInterface.createTable("payments",{
		id:{
			type:DataTypes.INTEGER,
			autoIncrement:true,
			primaryKey:true,
			allowNull:false
		},
		userId:{
			type:DataTypes.INTEGER,
			field:"user_id"
		},
		paymentStatus:{
			type:DataTypes.ENUM("SUCCESS","FAILED","PENDING"),
			defaultValue:"PENDING",
			field:"payment_status"
		},
		transactionId:{
			type:DataTypes.STRING,
			field:"transaction_id"
		},
		amount:{
			type:DataTypes.DECIMAL(10,2),
		},
		invoiceId:{
			type:DataTypes.INTEGER,
			field:"invoice_id"
		},
		type:{
			type:DataTypes.ENUM("COD","ONLINE")
		},
		gatewayResponse:{
			type:DataTypes.TEXT,
			field:"gateway_response"
		},
		paidAt:{
			type:DataTypes.DATE,
			field:"paid_at"
		}
	})
	
}
export async function down(queryInterface, Sequelize) {
	
}
