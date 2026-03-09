import {Router} from "express";
import jwt from "jsonwebtoken";
import { errorResponse } from "../apiResponse.js";
export const adminProtectedRoute = Router();

adminProtectedRoute.use(async (req, res, next) => {
	try {
		const token = req.cookies.token;
		const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
		if (decodedToken.role !== "admin") {
			return errorResponse(res,"Unauthorized user",403)
		}
		req.user=decodedToken
		next();
	} catch (error) {
		return errorResponse(res,"Unauthorized user",403)
	}
});
