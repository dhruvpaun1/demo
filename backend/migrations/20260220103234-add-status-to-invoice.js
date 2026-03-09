'use strict';

import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
	await queryInterface.addColumn("invoices","status",{
		type:DataTypes.ENUM(["PAID","UNPAID","CANCELLED"])
	})
}
export async function down(queryInterface, Sequelize) {
	await queryInterface.removeColumn("invoices","status")
}
