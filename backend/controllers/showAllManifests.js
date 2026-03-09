import { errorResponse, successResponse } from "../apiResponse.js";
import {Manifest} from "../models/Manifests.js";
import { Packages } from "../models/Packages.js";
import { User } from "../models/User.js";

export const showAllManifests = async (req, res) => {
	try {
		const adminId = req.user.id;
		const allManifests = await Manifest.findAll({
			include:[
				{model:Packages},
				{model:User,as:"creator"}
			]
		});
		successResponse(res,"Manifest data fetched successfully",allManifests,200)
	} catch (error) {
		console.log(error);
		
		errorResponse(res,"Error in showing manifests",500)
	}
};
