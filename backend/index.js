import express from "express";
import {db, sequelize} from "./dbConnection.js";
import cookieParser from "cookie-parser";
import {dashboardRoute} from "./routes/dashboard.js";
import {loginRoute} from "./routes/login_routes.js";
import {adminProtectedRoute} from "./middlewares/adminProtectedRoute.js";
import {authChecker} from "./middlewares/authMiddlewareRoute.js";
import {userRoute} from "./routes/userRoute.js";
import {packageAddRoute} from "./routes/packageRoute.js";
import {packageHistoryForUser} from "./routes/packageHistoryForUser.js";
import {configDotenv} from "dotenv";
import {QueryMessage} from "./models/QueryMessages.js";
import {QueryStatusHistory} from "./models/QueryStatusHistory.js";
import {Notification} from "./models/Notification.js";
import {Payments} from "./models/Payments.js";
configDotenv();
import cors from "cors";
import {profileRouter} from "./routes/profile.js";
import {User} from "./models/User.js";
import bcrypt from "bcrypt";
import { startWork } from "./helpers/worker.js";
import {generateInvoiceController} from "./controllers/generateInvoiceController.js";
import {invoiceRoute} from "./routes/invoiceRoute.js";
import {manifestRoute} from "./routes/manifestRoute.js";
import {applyAssociations} from "./modelsConnection.js";
import {PackageQueries} from "./models/PackagesQueries.js";
import {PackageQueryRouterForUser} from "./routes/packageQueryRouteForUser.js";
import {packageQueryRouterForAdmin} from "./routes/packageQueryRouterForAdmin.js";
import {notificationRouter} from "./routes/notificationRoute.js";
import {createServer} from "http";
import {Server} from "socket.io";
import {invoiceRouteForUser} from "./routes/invoiceRouteForUser.js";
import {paymentSuccessControler} from "./controllers/stripe/paymentSuccessController.js";
import {paymentIntentController} from "./controllers/stripe/paymentIntentController.js";
import {cronGenerator} from "./helpers/cronGenerator.js";
import cron from "node-cron";
import { mailHelper } from "./helpers/mailHelper.js";
import { deliveryRoute } from "./routes/deliveryRoute.js";
import { scheduleDelivery } from "./controllers/delivery/scheduleDeliveryController.js";
import { getAllScheduledDelivery } from "./controllers/delivery/getAllScheduledDelivery.js";
const app = express();
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: process.env.FRONTEND_ORIGIN,
		credentials: true,
	},
});
startWork()
cron.schedule("0 0 0 * * *", async () => {
	try {
		await cronGenerator();
	} catch (err) {
		console.error("Birthday cron failed:", err);
	}
});
io.on("connection", (socket) => {
	console.log("Connected:", socket.id);

	socket.on("register", (userId) => {
		socket.join(`user_${userId}`);
		console.log(`User ${userId} joined room user_${userId}`);
	});

	socket.on("disconnect", () => {
		console.log("Disconnected:", socket.id);
	});
});
export {io};

server.listen(process.env.PORT, () => console.log("Server started successfully"));
app.use(
	cors({
		origin: process.env.FRONTEND_ORIGIN,
		credentials: true,
	}),
);
applyAssociations();
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use("/", loginRoute);
app.use("/user", authChecker, profileRouter, packageHistoryForUser, PackageQueryRouterForUser, invoiceRouteForUser,deliveryRoute);
app.use("/api/admin", authChecker, adminProtectedRoute, dashboardRoute, userRoute, packageAddRoute, invoiceRoute, manifestRoute, packageQueryRouterForAdmin);
app.get('/api/admin/get-scheduled-deliveries',authChecker,adminProtectedRoute,getAllScheduledDelivery)
app.use("/notification", authChecker, notificationRouter);
app.post("/payment/create-stripe-intent", authChecker, paymentIntentController);
app.put("/payment/payment-success", authChecker, paymentSuccessControler);
// app.listen(process.env.PORT, () => console.log("Server started successfully"));
