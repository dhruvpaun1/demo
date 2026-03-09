import {errorResponse, successResponse} from "../apiResponse.js";
import {Manifest} from "../models/Manifests.js";
import {Packages} from "../models/Packages.js";

export const viewManifestPackages = async (req, res) => {
	try {
		const {manifestId} = req.params;
		const adminId = req.user.id;
		console.log(manifestId);

		const isAdminAuthorized = await Manifest.findOne({
			where: {
				id: manifestId,
			},
		});
		console.log(isAdminAuthorized);
		console.log(isAdminAuthorized?.createdBy);
		console.log(isAdminAuthorized?.get("createdBy"));
		console.log(isAdminAuthorized?.toJSON());

		if (!isAdminAuthorized) {
			return errorResponse(res, "Manifest does not exist", 404);
		}
		if(isAdminAuthorized.createdBy!==adminId)
		{
			return errorResponse(res, "You are not authorized to view this manifest", 403);
		}
		const packages = await Packages.findAll({
			where: {
				manifestId,
			},
		});
		if (!packages || packages.length === 0) {
			return errorResponse(res, "Packages not found");
		}
		return successResponse(res, "Packages fetched successfully", packages, 200);
	} catch (error) {
		console.log(error);
		return errorResponse(res, "Error in finding packages of this manifest id");
	}
};
