import {DataTypes} from "sequelize";
import {sequelize} from "../dbConnection.js";
export const Manifest = sequelize.define(
	"manifests",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		manifestName: {
			type: DataTypes.STRING(),
			allowNull: false,
			field: "manifest_name",
			unique:true
		},
		createdBy: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: "created_by",
		},
	},
	{
		tableName: "manifests",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: false,
	},
);
