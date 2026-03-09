"use strict";

export async function up(queryInterface, Sequelize) {
	const tables = await queryInterface.showAllTables();

	if (!tables.includes("users")) {
		await queryInterface.createTable("users", {
			id: {
				type: Sequelize.BIGINT,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true
			},
			name: {
				type: Sequelize.STRING(100),
				allowNull: true
			},
			email: {
				type: Sequelize.STRING(100),
				allowNull: true
			},
			password: {
				type: Sequelize.STRING,
				allowNull: true
			},
			status: {
				type: Sequelize.ENUM("active", "inactive"),
				allowNull: true
			},
			role: {
				type: Sequelize.ENUM("admin", "user"),
				defaultValue: "user"
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
			}
		});
	}
}
export async function down(queryInterface, Sequelize) {
	queryInterface.bulkDelete("users")
}
