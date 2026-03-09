import {errorResponse, successResponse} from "../apiResponse.js";
import {sequelize} from "../dbConnection.js";
import {Manifest} from "../models/Manifests.js";
import {Packages} from "../models/Packages.js";
export const createManifest = async (req, res) => {
	const transaction = await sequelize.transaction();
	try {
		const {manifestName} = req.body;
		const adminId = req.user.id;
		const isPackagesAvailable = await Packages.count({
			where: {
				manifestId: null,
			},
		});
		if (isPackagesAvailable === 0) {
			transaction.rollback()
			return errorResponse(res, "No packages avaialbale", 404);
		}
		const newManifest = await Manifest.create(
			{
				createdBy: adminId,
				manifestName,
			},
			{
				transaction: transaction,
			},
		);
		if (!newManifest) {
			await transaction.rollback();
			return errorResponse(res, "manifest with this name already exist", 400);
		}
		const updatedPackage = await Packages.update(
			{
				manifestId: newManifest.id,
			},
			{
				where: {
					manifestId: null,
				},
				transaction: transaction,
			},
		);
		if (!updatedPackage || updatedPackage[0] === 0) {
			await transaction.rollback();
			return errorResponse(res, "Could not update package because it is already added in another manifest or it does not exist", 400);
		}
		await transaction.commit();
		successResponse(res, "Packages updated successfully and manifest created successfully", {}, 201);
	} catch (error) {
		console.log(error);
		await transaction.rollback()
		return errorResponse(res, "this name is already taken", 500);
	}
};
