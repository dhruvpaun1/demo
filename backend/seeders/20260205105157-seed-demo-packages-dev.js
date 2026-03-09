"use strict";

export async function up(queryInterface,Sequelize) {
	const userId = await queryInterface.rawSelect(
		"users",
		{
			where: {
				role: "user",
			},
			limit: 1,
		},
		["id"],
	);
	if (!userId) return;
	const packages = await queryInterface.rawSelect("packages", {attributes:[[Sequelize.fn("COUNT", Sequelize.col("id")), "count"]]},"count" );
	if (packages > 0) return;

	await queryInterface.bulkInsert("packages",[{
		user_id:userId,
		tracking_number:"ABC_123",
		weight:10,
		item_cost:100,
		note:"hello",
		created_at:new Date(Date.now())
	}],{
		ignoreDuplicates:true
	})
}
export async function down() {
	await queryInterface.bulkDelete("packages")
}
