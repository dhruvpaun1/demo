"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
	await queryInterface.addColumn("packages", "manifestId", {
		type: Sequelize.INTEGER,
		allowNull: true,
		references: {
			model: "manifests",
			key: "id",
		},
		onDelete:"SET NULL",
		onUpdate:"CASCADE"
	});
}
export async function down(queryInterface) {
  await queryInterface.removeColumn("packages", "manifest_id");
}
