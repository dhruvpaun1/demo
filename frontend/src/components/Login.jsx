import { useForm } from "react-hook-form";
import { api } from "../axiosSetup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../authSlice";
import { useState } from "react";
import { API_ENDPOINT } from "../apiEndpoints";

function Login() {
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm();

    const [status, setStatus] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onSubmit = async (data) => {
        try {
            const res = await api.post(API_ENDPOINT.login, data);
            if (res.data.success) {
                dispatch(
                    login({
                        user: res.data.results|| res.data.results.name || "User",
                        role: res.data.results.role,
                    }),
                );
                navigate(res.data.results.role === "admin" ? "/admin/dashboard" : "/profile");
            } else {
                setStatus(res.data.message);
            }
        } catch (error) {
            setStatus(error.response?.data?.message || "Authentication service unavailable");
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-[#1e293b] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
                
                <div className="p-8 text-center bg-slate-800/50 border-b border-slate-800">
                    <div className="inline-flex h-12 w-12 bg-sky-500 rounded-xl items-center justify-center mb-4">
                        <span className="text-[#0f172a] font-black text-2xl">F</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Fleet Access</h1>
                    <p className="text-slate-400 text-sm mt-1">Personnel Secure Login</p>
                </div>

                <div className="p-8">
                    {status && (
                        <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg text-center animate-pulse">
                            {status}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Username</label>
                            <input 
                                type="text" 
                                {...register("username", { required: "Identity required" })}
                                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                                placeholder="Enter username"
                            />
                            {errors.username && <span className="text-rose-500 text-[10px] mt-1 uppercase font-bold">{errors.username.message}</span>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
                            <input 
                                type="password" 
                                {...register("password", { required: "Credentials required" })}
                                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                                placeholder="••••••••"
                            />
                            {errors.password && <span className="text-rose-500 text-[10px] mt-1 uppercase font-bold">{errors.password.message}</span>}
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 disabled:cursor-not-allowed text-[#0f172a] font-bold py-3 rounded-lg transition-all transform active:scale-[0.98] shadow-lg shadow-sky-500/20"
                        >
                            {isSubmitting ? "Verifying..." : "Authorize Login"}
                        </button>
                    </form>
                </div>

                <div className="px-8 py-4 bg-slate-800/30 border-t border-slate-800 text-center">
                    <p className="text-slate-500 text-xs">
                        Encryption Protocol: <span className="text-sky-500/60 font-mono">TLS 1.3 Active</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;