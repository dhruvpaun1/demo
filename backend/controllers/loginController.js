import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {User} from "../models/User.js";
import { errorResponse, successResponse } from "../apiResponse.js";
export const loginController=async (req, res) => {
	const {username, password} = req.body;
	if (!username || !password) {
		errorResponse(res,"Error in editing user",400)
	}
	const user = await User.findOne({
		where: {
			name: username,
		},
	});
	console.log(user);
	
	if (!user) {
		errorResponse(res,"Invalid Username or Password",400)
	}

	if (!(await bcrypt.compare(password, user.password))) {
		errorResponse(res,"Invalid Username or Password",400)
	}
	const token = jwt.sign({id: user.id, username: user.name, role: user.role}, process.env.SECRET_KEY);
	res.cookie("token", token);
	return successResponse(res,"Login success",{id: user.id, username: user.name, role: user.role},200)
}