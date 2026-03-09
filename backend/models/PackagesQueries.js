import { DataTypes } from "sequelize";
import { sequelize } from "../dbConnection.js";

export const PackageQueries=sequelize.define("package_queries",{
	id:{
		type:DataTypes.INTEGER,
		allowNull:false,
		autoIncrement:true,
		primaryKey:true
	},
	status:{
		type:DataTypes.ENUM("Submitted","Processing","Resolved","Respond","Customer Respond")
	},
	packageId:{
		type:DataTypes.INTEGER,
		allowNull:false,
		field:"package_id"
	},
	userId:{
		type:DataTypes.INTEGER,
		allowNull:false,
		field:"user_id"
	},
	notes:{
		type:DataTypes.STRING,
		allowNull:false
	},
	attachment:{
		type:DataTypes.STRING
	}
},
{
	tableName:"package_queries",
}
)