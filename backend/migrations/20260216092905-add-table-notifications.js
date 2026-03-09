'use strict';


/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
	await queryInterface.createTable("notifications",{
		id:{
			type:Sequelize.INTEGER,
			primaryKey:true,
			autoIncrement:true
		},
		sendBy:{
			type:Sequelize.INTEGER,
		},
		userId:{
			type:Sequelize.INTEGER
		},
		message:{
			type:Sequelize.STRING(255),
			allowNull:false,
		},
		typeOfNotification:{
			type:Sequelize.STRING()
		},
		status:{
			type:Sequelize.ENUM(["read","unread"])
		}
	})
}
export async function down(queryInterface, Sequelize) {
	await queryInterface.dropTable("notifications");
}
