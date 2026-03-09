import { DataTypes } from "sequelize";
import { sequelize } from "../dbConnection.js";

export const PackageStatusHistory=sequelize.define("packagesStatusHistory",{
	id:{
		type:DataTypes.INTEGER,
		primaryKey:true,
		autoIncrement:true,
		field:"id"
	},
	packageId:{
		type:DataTypes.INTEGER,
		field:"package_id",
		allowNull:false
	},
	oldStatus:{
		type:DataTypes.STRING(50),
		field:"old_status",
		allowNull:false
	},
	newStatus:{
		type:DataTypes.STRING(50),
		field:"new_status",
		allowNull:false
	},
	changedBy:{
		type:DataTypes.INTEGER,
		field:"changed_by",
		allowNull:true
	}
},{
	tableName:"package_status_history",
	timestamps:true,
	createdAt:"created_at",
	updatedAt:false
})