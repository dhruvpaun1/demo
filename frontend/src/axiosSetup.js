import axios from "axios";

export const api=axios.create({
	baseURL:import.meta.env.VITE_ORIGIN_URL,
	withCredentials:true
})