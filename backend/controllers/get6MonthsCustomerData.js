import { Op, fn, col, literal } from "sequelize";
import {successResponse} from "../apiResponse.js"
import {User} from "../models/User.js";
export const getLast6MonthsUsers = async (req,res) => {
  const result = await User.findAll({
    attributes: [
      [fn("DATE_FORMAT", col("created_at"), "%Y-%m"), "month"],
      [fn("COUNT", col("id")), "total"],
    ],
    where: {
      role: "user",
      created_at: {
        [Op.gte]: literal("DATE_SUB(CURDATE(), INTERVAL 7 MONTH)")
      }
    },
    group: [fn("DATE_FORMAT", col("created_at"), "%Y-%m")],
    order: [[literal("month"), "ASC"]],
    raw: true,
  });

  return successResponse(res,"6 months customer data fetched successfully",{result},200)
};
