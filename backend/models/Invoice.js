import {DataTypes} from "sequelize";
import {sequelize} from "../dbConnection.js";

export const InvoiceModel = sequelize.define(
	"invoice",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		invoiceNumber: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			field: "invoice_number",
		},
		packageId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: "package_id",
			references: {
				model: "packages",
				key: "id",
			},
		},
		trackingNumber: {
			type: DataTypes.STRING,
			allowNull: false,
			field: "tracking_number",
		},
		totalWeight: {
			type: DataTypes.FLOAT,
			allowNull: false,
			field: "total_weight",
		},
		packageCost: {
			type: DataTypes.FLOAT,
			allowNull: false,
			field: "package_cost",
		},
		deliveryCost:{
			type:DataTypes.INTEGER,
			allowNull:false,
			defaultValue:1,
			field:"delivery_cost"
		},
		invoiceCreatedBy: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: "invoice_created_by",
			references: {
				model: "users",
				key: "id",
			},
		},
		status:{
			type:DataTypes.ENUM("PAID","UNPAID","CANCELLED"),
			defaultValue:"UNPAID"
		}
	},
	{
		timestamps: true,
		tableName: "invoices",
		createdAt: "created_at",
		updatedAt: false,
	},
);
