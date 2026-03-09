import {User} from "./models/User.js";
import {PackageStatusHistory} from "./models/PackageStatusHistory.js";
import {Packages} from "./models/Packages.js";
import {Manifest} from "./models/Manifests.js";
import {PackageQueries} from "./models/PackagesQueries.js";
import {QueryMessage} from "./models/QueryMessages.js";
import {QueryStatusHistory} from "./models/QueryStatusHistory.js";
import {Notification} from "./models/Notification.js";
import {InvoiceModel} from "./models/Invoice.js";
import { Payments } from "./models/Payments.js";
export function applyAssociations() {
	User.hasMany(Packages, {
		foreignKey: "user_id",
	});
	Packages.belongsTo(User, {
		foreignKey: "user_id",
	});

	Packages.hasMany(PackageStatusHistory, {
		foreignKey: "package_id",
	});
	PackageStatusHistory.belongsTo(Packages, {
		foreignKey: "package_id",
	});

	PackageStatusHistory.belongsTo(User, {
		foreignKey: "changed_by",
	});
	Manifest.hasMany(Packages, {
		foreignKey: "manifestId",
	});

	Packages.belongsTo(Manifest, {
		foreignKey: "manifestId",
	});

	Manifest.belongsTo(User, {
		foreignKey: "createdBy",
		as: "creator",
	});
	PackageQueries.hasMany(QueryMessage, {
		foreignKey: "queryId",
		as: "messages",
	});

	QueryMessage.belongsTo(PackageQueries, {
		foreignKey: "queryId",
		as: "query",
	});
	PackageQueries.hasMany(QueryStatusHistory, {
		foreignKey: "queryId",
		as: "statusHistory",
	});

	QueryStatusHistory.belongsTo(PackageQueries, {
		foreignKey: "queryId",
		as: "query",
	});
	PackageQueries.belongsTo(User, {
		foreignKey: "userId",
		as: "customer",
	});

	QueryStatusHistory.belongsTo(User, {
		foreignKey: "changedBy",
		as: "changedByUser",
	});
	Packages.hasMany(PackageQueries, {
		foreignKey: "packageId",
		as: "queries",
	});

	PackageQueries.belongsTo(Packages, {
		foreignKey: "packageId",
		as: "package",
	});
	User.hasMany(QueryStatusHistory, {
		foreignKey: "changedBy",
		as: "queryStatusChanges",
	});
	User.hasMany(PackageQueries, {
		foreignKey: "userId",
	});
	QueryMessage.belongsTo(User, {
		foreignKey: "sendBy",
		as: "sender",
	});
	InvoiceModel.belongsTo(Packages, {
		foreignKey: "package_id",
		as: "package",
	});
	Packages.hasOne(InvoiceModel, {
		foreignKey: "package_id",
		as: "invoice",
	});
	User.hasMany(Notification, {foreignKey: "userId", as: "receiveNotifications"});
	User.hasMany(Notification, {foreignKey: "sendBy", as: "sendNotifications"});

	Notification.belongsTo(User, {foreignKey: "userId", as: "receiveNotifications"});
	Notification.belongsTo(User, {foreignKey: "sendBy", as: "sendNotifications"});

	InvoiceModel.hasOne(Payments,{
		foreignKey:"invoiceId"
	})
	Payments.belongsTo(InvoiceModel,{
		foreignKey:"invoiceId"
	})
}
