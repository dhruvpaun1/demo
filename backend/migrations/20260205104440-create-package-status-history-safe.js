"use strict";

export async function up(queryInterface, Sequelize) {
	const tables = await queryInterface.showAllTables();

	if (!tables.includes("package_status_history")) {
		await queryInterface.createTable("package_status_history", {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true
			},

			package_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "packages",
					key: "id"
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE"
			},

			old_status: {
				type: Sequelize.STRING(50),
				allowNull: false
			},

			new_status: {
				type: Sequelize.STRING(50),
				allowNull: false
			},

			changed_by: {
				type: Sequelize.BIGINT,
				allowNull: true,
				references: {
					model: "users",
					key: "id"
				},
				onUpdate: "CASCADE",
				onDelete: "SET NULL"
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
	queryInterface.bulkDelete("package_status_history")
}
