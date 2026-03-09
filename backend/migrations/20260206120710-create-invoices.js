"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
	await queryInterface.createTable("invoices", {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		invoice_number: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true,
		},
		package_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			unique:true,
			field: "package_id",
			references: {
				model: "packages",
				key: "id",
			},
		},
		tracking_number: {
			type: Sequelize.STRING,
			allowNull: false,
			field: "tracking_number",
		},
		total_weight: {
			type: Sequelize.FLOAT,
			allowNull: false,
			field: "total_weight",
		},
		package_cost: {
			type: Sequelize.FLOAT,
			allowNull: false,
			field: "package_cost",
		},
		delivery_cost:{
			type:Sequelize.INTEGER,
			allowNull:false,
			default:1,
			field:"delivery_cost"
		},
		invoice_created_by: {
			type: Sequelize.INTEGER,
			allowNull: false,
			field: "invoice_created_by",
			references: {
				model: "users",
				key: "id",
			},
		},
		created_at: {
			type: Sequelize.DATE,
			field: "created_at",
		}
	});
}
export async function down(queryInterface, Sequelize) {
	await queryInterface.dropTable("invoices")
}
