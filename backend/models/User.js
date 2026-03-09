import { DataTypes } from "sequelize";
import { sequelize } from "../dbConnection.js";
export const User=sequelize.define("Users",{
	id:{
		type:DataTypes.BIGINT,
		primaryKey:true,
		autoIncrement:true,
	},
	name:{
		type:DataTypes.STRING(100),
		field:"name"
	},
	dateOfBirth:{
		type:DataTypes.DATE,
		allowNull:true,
		field:"date_of_birth"
	},
	email:{
		type:DataTypes.STRING(100),
		field:"email"
	},
	password:{
		type:DataTypes.STRING,
		field:"password"
	},
	status:{
		type:DataTypes.ENUM("active","inactive"),
		field:"status"
	},
	role:{
		type:DataTypes.ENUM("admin","user"),
		defaultValue:"user",
		field:"role"
	}
},{tableName:"users",timestamps:true,createdAt:"created_at",updatedAt:false})