import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../src/authSlice"
export default configureStore({
	reducer:{
		auth:authSlice
	}
})