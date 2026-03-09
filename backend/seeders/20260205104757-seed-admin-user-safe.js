"use strict";

export async function up(queryInterface) {
	await queryInterface.bulkInsert("users",[
		{
			name:"Admin",
			email:"Admin@123.com",
			role:"admin",
			status:"active",
			created_at:new Date()
		},
		{
			name:"user1",
			email:"user@123.com",
			role:"user",
			status:"active",
			created_at:new Date()
		}
	],{
		ignoreDuplicates:true
	})
}
export async function down() {
	await queryInterface.bulkDelete("users")
}