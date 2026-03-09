import { DataTypes } from "sequelize";
import {sequelize} from "../dbConnection.js";

export const Notification = sequelize.define("notifications", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	sendBy: {
		type: DataTypes.INTEGER
	},
	userId: {
		type: DataTypes.INTEGER,
	},
	message: {
		type: DataTypes.STRING(255),
		allowNull: false,
	},
	typeOfNotification: {
		type: DataTypes.STRING(),
		required:true
	},
	status: {
		type: DataTypes.ENUM(["read", "unread"]),
		defaultValue:"unread"
	},
});
