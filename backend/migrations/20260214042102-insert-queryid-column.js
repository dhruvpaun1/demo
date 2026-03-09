'use strict';

import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
	await queryInterface.addColumn("query_status_history","query_id",{type:DataTypes.INTEGER})
}
export async function down(queryInterface, Sequelize) {
	await queryInterface.removeColumn("query_status_history","query_id")
}
