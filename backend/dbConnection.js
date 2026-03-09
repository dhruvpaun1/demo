import {Sequelize} from "sequelize"
import { configDotenv } from "dotenv"
configDotenv()
export const sequelize=new Sequelize({
	database:process.env.DB_DATABASE,
	password:process.env.DB_PASSWORD,
	username:process.env.DB_USER,
	host:process.env.DB_HOST,
	dialect:"mysql"
})

export const db=async()=>{
	try {
		await sequelize.authenticate()
		console.log("Db connected successfully");
		await sequelize.sync()
		console.log("db sync successfully");
		
	} catch (error) {
		console.log("Error in connecting db",error);
	}
}
db()

