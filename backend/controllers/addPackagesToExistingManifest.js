import {errorResponse, successResponse} from "../apiResponse.js";
import {sequelize} from "../dbConnection.js";
import {Manifest} from "../models/Manifests.js";
import {Packages} from "../models/Packages.js";

export const addPackagesToExistingManifest = async (req, res) => {
	const t = await sequelize.transaction();
	try {
		const {manifestId, packages} = req.body;
		const manifest = await Manifest.findOne({
			where: {
				id: manifestId,
			},
			transaction: t,
			lock: true,
		});
		if (!manifest) {
			await t.rollback();
			errorResponse(res, "Could not find manifest", 404);
		}
		const packagesData = await Packages.findAll({
			where: {id: packages},
			transaction: t,
			lock: true,
		});

		for (const pkg of packagesData) {
			if (pkg.manifestId) {
				await t.rollback();
				return errorResponse(res, "Package already assigned", 400);
			}
		}
		const packagesToBeUpdated = await Packages.update(
			{
				manifestId,
			},
			{
				where: {
					id: packages,
				},
				transaction: t,
			},
		);
		if (!packagesToBeUpdated) {
			await t.rollback();
			return errorResponse(res, "Could not update manifest");
		}
		await t.commit();
		successResponse(res, "Packages updated successfully", {}, 201);
	} catch (error) {
		await t.rollback();
		return errorResponse(res, "Error in Addig packages to existing manifest");
	}
};
