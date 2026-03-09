import bcrypt from "bcrypt"
import { User } from "../models/User.js";
import { errorResponse, successResponse } from "../apiResponse.js";
import cron from "node-cron"
export const addUserController=async (req, res) => {
	const {name, email, password, status,dob} = req.body;
	const [day,month,year]=dob.split("-").map(Number)
	const utcDate=new Date(Date.UTC(year,month-1,day,0,0,0))
	const hashedPassword = await bcrypt.hash(password, 10);
	const newUser = await User.create({
		name,
		email,
		password: hashedPassword,
		status,
		dateOfBirth:utcDate
	});
	if (!newUser) {
		return errorResponse(res,"Error occured in adding user",401)
	}
	
	return successResponse(res,"user added successfully",{},201)
}