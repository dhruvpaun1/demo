import { DataTypes, INTEGER } from "sequelize";
import { sequelize } from "../dbConnection.js";

export const QueryMessage=sequelize.define("query_messages",{
	id:{
		type:DataTypes.INTEGER,
		allowNull:false,
		primaryKey:true,
		autoIncrement:true
	},
	queryId:{
		type:DataTypes.INTEGER,
		allowNull:false,
		field:"query_id"
	},
	sendBy:{
		type:DataTypes.INTEGER,
		allowNull:false,
		field:"send_by"
	},
	senderRole:{
		type:DataTypes.ENUM("admin","user"),
		field:"sender_role"
	},
	message:{
		type:DataTypes.STRING(400),
		allowNull:false
	},
	attachment:{
		type:DataTypes.STRING(255),
		allowNull:true
	}
},{
	tableName:"query_message"
})