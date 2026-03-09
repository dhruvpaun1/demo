import {Queue} from "bullmq"
export const birthdayQueue=new Queue("birthday-queue",{
	connection:{
		host:'127.0.0.1',
		port:6379
	}
})
export const addBirthdayDataToQueue=async (user,age)=>{
	console.log("Reached to queue");
	
	await birthdayQueue.add("birthday-data",{user,age},{
		attempts:3,
		backoff:{
			type:"exponential",
			delay:5000
		}
	})
}