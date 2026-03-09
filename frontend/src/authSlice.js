import {createSlice} from "@reduxjs/toolkit";
const savedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

const savedRole = localStorage.getItem("role");
const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: savedUser,
		isAuthenticated: !!savedUser,
		role: savedRole,
	},
	reducers: {
		login(state, action) {
			state.user = action.payload.user; // full object
			state.isAuthenticated = true;
			state.role = action.payload.role;

			localStorage.setItem("user", JSON.stringify(action.payload.user));
			localStorage.setItem("role", action.payload.role);
		},
		logout(state) {
			state.user = null;
			state.isAuthenticated = false;
			state.role = null;
			localStorage.removeItem("user");
			localStorage.removeItem("role");
		},
	},
});

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;
