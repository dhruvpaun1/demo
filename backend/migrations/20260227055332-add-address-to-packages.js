'use strict';

import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
	await queryInterface.addColumn("packages","delivery_details",{
		type:DataTypes.JSON,
		allowNull:true
	})
}
export async function down(queryInterface, Sequelize) {
	await queryInterface.removeColumn("packages","address")
}
