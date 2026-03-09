import { errorResponse, successResponse } from "../apiResponse.js"
import { sequelize } from "../dbConnection.js"
import { PackageQueries } from "../models/PackagesQueries.js"
import { QueryStatusHistory } from "../models/QueryStatusHistory.js"

export const statusChanger=async (newStatus,changedBy,queryId,transaction)=>{
	try {
		const queryFinder=await PackageQueries.findOne({
			where:{
				id:queryId
			},transaction
		})
		const oldStatus=queryFinder.status
		if (oldStatus === "Resolved") {
			await transaction.rollback()
			throw new Error("Cannot change status of resolved query");
		}
		if(oldStatus===newStatus)
		{
			await transaction.rollback()
			throw new Error("Both status are same")
		}
		queryFinder.status=newStatus
		await queryFinder.save({transaction})
		const changeStatus=await QueryStatusHistory.create({
			oldStatus,
			changedBy,
			newStatus,
			queryId
		},{
			transaction
		})
		return { success: true };
	} catch (error) {
		throw error;
	}
}