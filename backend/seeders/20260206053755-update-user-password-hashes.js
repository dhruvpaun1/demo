"use strict";
import bcrypt from "bcrypt"
import {configDotenv} from "dotenv"
configDotenv()
export async function up(queryInterface) {
	const hashForAdmin=bcrypt.hashSync(process.env.ADMIN_PASSWORD,10)
	await queryInterface.bulkUpdate("users",
		{
			password:hashForAdmin,
		},{
			name:"Admin"
		})
}
export async function down() {
	await queryInterface.bulkDelete("users")
}