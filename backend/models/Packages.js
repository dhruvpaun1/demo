import { DataTypes } from "sequelize";
import { sequelize } from "../dbConnection.js";

export const Packages=sequelize.define("packages",{
	id:{
		type:DataTypes.INTEGER,
		primaryKey:true,
		autoIncrement:true,
		field:"id"
	},
	userId:{
		type:DataTypes.INTEGER,
		allowNull:true,
		field:"user_id"
	},
	trackingNumber:{
		type:DataTypes.STRING(100),
		field:"tracking_number",
		allowNull:true
	},
	weight:{
		type:DataTypes.FLOAT,
		field:"weight",
		allowNull:true
	},
	itemCost:{
		type:DataTypes.FLOAT,
		field:"item_cost",
		allowNull:true
	},
	note:{
		type:DataTypes.TEXT,
		field:"note"
	},
	attachment:{
		type:DataTypes.STRING(255),
		field:"attachment"
	},
	status:{
		type:DataTypes.ENUM("Pending","Packed","Ready for Shipment", "Shipped", "Received", "Ready to Deliver", "Delivered to Warehouse", "Ready for Dispatch","Delivered To Customer"),
		defaultValue:"Pending"
	},
	deliveryDetails:{
		type:DataTypes.JSON,
		allowNull:true,
		field:"delivery_details"
	}
},{
	tableName:"packages",
	createdAt:"created_at",
	timestamps:true,
	updatedAt:false
})