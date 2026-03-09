'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
	await queryInterface.addConstraint("manifests",{
		fields:["manifest_name"],
		type:"unique",
		name:"unique_manifest_name"
	})
}
export async function down(queryInterface, Sequelize) {
	await queryInterface.removeConstraint("manifests","unique_manifest_name")
}
