import { col, fn, literal, Op } from "sequelize";
import { errorResponse, successResponse } from "../apiResponse.js";
import { User } from "../models/User.js";

export const getCustomData = async (req, res) => {
	try {
		const {startDate, endDate} = req.query;
		const result = await User.findAll({
			attributes: [
				[fn("DATE_FORMAT", col("created_at"), "%Y-%m"), "month"],
				[fn("COUNT", col("id")), "total"],
			],
			where: {
				role: "user",
				created_at: {
					[Op.gte]: startDate,
					[Op.lte]: (endDate+" 23:59:59")
				},
			},
			group: [fn("DATE_FORMAT", col("created_at"), "%Y-%m")],
			order: [[literal("month"), "ASC"]],
			raw: true,
		});
		return successResponse(res,"Data fetched successfully",result,200)
	} catch (error) {
		console.log(error);
		
		return errorResponse(res,"Error in getting custom data",500)
	}
};
