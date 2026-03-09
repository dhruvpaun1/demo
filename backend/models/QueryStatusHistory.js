import {DataTypes} from "sequelize";
import {sequelize} from "../dbConnection.js";

export const QueryStatusHistory = sequelize.define("query_status_history", {
	id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		autoIncrement: true,
		primaryKey:true
	},
	queryId:{
		type:DataTypes.INTEGER,
		field:"query_id"
	},
	oldStatus: {
		type: DataTypes.STRING,
		allowNull: false,
		field:"old_status"
	},
	newStatus: {
		type: DataTypes.STRING,
		allowNull: false,
		field:"new_status"
	},
	changedBy:{
		type:DataTypes.INTEGER,
		allowNull:false,
		field:"changed_by"
	}
},{
	tableName:"query_status_history"
});
