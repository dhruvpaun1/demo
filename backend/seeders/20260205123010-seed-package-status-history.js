'use strict';

export async function up(queryInterface, Sequelize) {
	const userId=await queryInterface.rawSelect("users",{
		where:{
			role:"admin"
		},
		limit:1
	},["id"])	
	if(!userId) return
	const packageId=await queryInterface.rawSelect("packages",{limit:1},["id"])
	if(!packageId) return
	await queryInterface.bulkInsert("package_status_history",[{
		changed_by:userId,
		old_status:"Pending",
		new_status:"Delivered",
		package_id:packageId,
		created_at:new Date(Date.now())
	}])
}
export async function down(queryInterface, Sequelize) {
	await queryInterface.bulkDelete("package_status_history")
}
