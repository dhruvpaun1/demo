import {errorResponse, successResponse} from "../apiResponse.js";
import {Packages} from "../models/Packages.js";
import {PackageStatusHistory} from "../models/PackageStatusHistory.js";

export const editPackageController = async (req, res) => {
	const packageId = req.params.id;
	const {newStatus} = req.body;
	const adminId = req.user.id;
	const oldStatus = await Packages.findOne({
		where: {
			id: packageId,
		},
	});
	if (!oldStatus) {
		errorResponse(res, "Package not found", 404);
	}
	const updatedPackage = await Packages.update(
		{
			status: newStatus,
		},
		{
			where: {
				id: packageId,
			},
		},
	);
	if (!updatedPackage) {
		errorResponse(res, "Status update failed", 500);
	}
	const packageStatusHistory = await PackageStatusHistory.create({
		oldStatus: oldStatus.status,
		newStatus,
		changedBy: adminId,
		packageId
	});
	if (!packageStatusHistory) {
		errorResponse(res, "History insert failed or some error occured", 500);
	}
	successResponse(res, "Status updated and history saved", {}, 200);
};
