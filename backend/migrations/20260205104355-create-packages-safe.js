"use strict";

export async function up(queryInterface, Sequelize) {
	const tables = await queryInterface.showAllTables();

	if (!tables.includes("packages")) {
		await queryInterface.createTable("packages", {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true
			},

			user_id: {
				type: Sequelize.BIGINT,
				allowNull: true,
				references: {
					model: "users",
					key: "id"
				},
				onUpdate: "CASCADE",
				onDelete: "SET NULL"
			},

			tracking_number: {
				type: Sequelize.STRING(100),
				allowNull: true
			},

			weight: {
				type: Sequelize.FLOAT,
				allowNull: true
			},

			item_cost: {
				type: Sequelize.FLOAT,
				allowNull: true
			},

			note: {
				type: Sequelize.TEXT,
				allowNull: true
			},

			attachment: {
				type: Sequelize.STRING(255),
				allowNull: true
			},

			status: {
				type: Sequelize.ENUM(
					"Pending",
					"Packed",
					"Ready for Shipment",
					"Shipped",
					"Received",
					"Ready to Deliver",
					"Delivered"
				),
				defaultValue: "Pending"
			},

			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
			}
		});
	}
}
export async function down(queryInterface,Sequelize) {
	queryInterface.bulkDelete("packages")
}
