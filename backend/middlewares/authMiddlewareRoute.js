import {Router} from "express";
import jwt from "jsonwebtoken";
import { errorResponse } from "../apiResponse.js";
export const authChecker = Router();

authChecker.use(async (req, res, next) => {
	try {
		const token = req.cookies.token;
		const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
		if (!decodedToken) {
			return errorResponse(res,"Unauthorized user",403)
		}
		req.user=decodedToken
		next();
	} catch (error) {
		return errorResponse(res,"Error in verifying authentication",403)
	}
});
