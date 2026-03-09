import nodemailer from "nodemailer";
import fs from "fs"
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const mailHelper = async (user, age) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: process.env.SMTP_USER_SECRET_KEY,
            pass: process.env.SMTP_PASS_SECRET_KEY,
        },
    });

    let htmlContent=fs.readFileSync(path.join(__dirname,'../template/mailTemplate.html'),"utf-8")
	htmlContent=htmlContent.replace("{receiverName}",user.name).replaceAll("{age}",age)

    try {
        const info = await transporter.sendMail({
            from: '"Celebration Team" <ramiro.legros27@ethereal.email>',
            to: user.email,
            subject: `✨ A Special Surprise for ${user.name}!`,
            text: `Happy Birthday, ${user.name}!`,
            html: htmlContent,
        });
        console.log(`Mail sent to: ${user.email}`);
        return true
    } catch (error) {
        console.log("Error in sending mail",error);
    }
};