import { Worker } from "bullmq";
import { mailHelper } from "./mailHelper.js";

export const startWork= ()=>{
	console.log("WOrk started");
	
	const worker=new Worker("birthday-queue",async (job)=>{
		console.log("Processing email for ",job.data.user.name);
		await mailHelper(job.data.user,job.data.age)
	},{
		connection:{
			host:"127.0.0.1",
			port:6379
		}
	})
	worker.on("completed",(job)=>{
		console.log("JOb completed for job id : ",job.id);
	})
	worker.on("failed",(job,err)=>{
		console.log(`Job failed for ${job.id} because of ${err.message}`);
		
	})
}