'use strict';

import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
	await queryInterface.addColumn("users","date_of_birth",{
		type:DataTypes.DATE,
		allowNull:true
	})
}
export async function down(queryInterface, Sequelize) {
	await queryInterface.removeColumn("users","date_of_birth")
}
