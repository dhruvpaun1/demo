import {successResponse} from "../apiResponse.js";
import {sequelize} from "../dbConnection.js";
import {Packages} from "../models/Packages.js";
import {User} from "../models/User.js";
import {PackageQueries} from "../models/PackagesQueries.js";
export const dashboardController = async (req, res) => {
	const results = {};
	const users = await User.count({
		where: {
			role: "user",
		},
	});
	results.users = users;
	const packages = await Packages.count();
	results.packages = packages;
	const statusCounts = await Packages.findAll({
		attributes: ["status", [sequelize.fn("COUNT", sequelize.col("id")), "count"]],
		group: ["status"],
	});
	console.log("status counts",statusCounts);
	
	statusCounts.forEach((item) => {
		results[item.status] = parseInt(item.get("count"));
	});
	const queryStatusCounts = await PackageQueries.findAll({
		attributes: ["status", [sequelize.fn("COUNT", sequelize.col("id")), "count"]],
		group: ["status"],
		raw: true,
	});
	console.log("query status count",queryStatusCounts);
	

	results.queryStatusCounts = [];

	queryStatusCounts.forEach((item) => {
		results.queryStatusCounts.push({
			status: item.status,
			count: parseInt(item.count),
		});
	});
	const packageQueries = await PackageQueries.count();
	results.packageQueriesCounts = packageQueries;
	results.statusCounts = statusCounts;
	successResponse(res, "Dashboard data fetched", results, 200);
};
