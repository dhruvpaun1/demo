import {errorResponse, successResponse} from "../apiResponse.js";
import {Manifest} from "../models/Manifests.js";

export const getManifestById = async (req, res) => {
	const {id} = req.body;
	try {
		const manifest = await Manifest.findOne({
			where: {
				id,
			},
		});
		if (!manifest) {
			errorResponse(res, "could not find manifest", 404);
		}
		successResponse(res,"manifest fetched successfully",manifest,200)
	} catch (error) {
		errorResponse(res,"error in finding manifest by id",500)
	}
};
