import {User} from "../models/User.js";
import { addBirthdayDataToQueue } from "./birthdatDataQueue.js";
import {mailHelper} from "./mailHelper.js";

export const cronGenerator = async () => {
	try {
		const users = await User.findAll();
		const now = new Date();
		const todayDate = now.getUTCDate();
		const todayMonth = now.getUTCMonth() + 1;
		const currentYear = now.getUTCFullYear();
		for (const user of users) {
			const dob = new Date(user.dateOfBirth);
			if (dob.getUTCDate() === todayDate && dob.getUTCMonth() + 1 === todayMonth) {
				const age = currentYear - dob.getUTCFullYear();
				console.log("birthday of ",user.name);
				
				await addBirthdayDataToQueue(user,age)
			}
			
		}
		return {success: true};
	} catch (error) {
		console.error("CRON ERROR:", error);
		return {success: false};
	}
};
