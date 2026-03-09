"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
	await queryInterface.createTable("manifests", {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		manifestName: {
			type: Sequelize.STRING(),
			allowNull: false,
			field: "manifest_name",
		},
		createdBy: {
			type: Sequelize.INTEGER,
			allowNull: true,
			field: "created_by",
		},
		created_at: {
			allowNull: false,
			type: Sequelize.DATE,
		},
	});
}
export async function down(queryInterface, Sequelize) {
	await queryInterface.dropTable("manifests");
}
