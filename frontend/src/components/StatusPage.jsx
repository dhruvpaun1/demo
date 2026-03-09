import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../axiosSetup";
import { API_ENDPOINT } from "../apiEndpoints";

export default function StatusPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const confirmPayment = async () => {
            const intentId = searchParams.get("payment_intent");
            const invId = searchParams.get("invoiceId"); 
            const redirectStatus = searchParams.get("redirect_status");

            if (!intentId || !invId) return;

            if (redirectStatus === "failed") {
                setError("Payment Declined by Issuer");
                setLoading(false);
                return;
            }

            try {
                const res = await api.put(API_ENDPOINT.confirmPayment, {
                    paymentIntentId: intentId,
                    invoiceId: invId,
                });

                if (res.data.success) {
                    setVerified(true);
                } else {
                    setError(res.data.message);
                }
            } catch (err) {
                setError(err.response?.data?.message || "System Verification Error");
            } finally {
                setLoading(false);
            }
        };

        confirmPayment();
    }, [searchParams]);

    // Timer logic for redirect
    useEffect(() => {
        if (!loading && (verified || error)) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        navigate("/user/view-invoice"); // Adjust this path to your invoices route
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [loading, verified, error, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-4"></div>
                <h2 className="text-white font-black uppercase tracking-widest text-xs">Syncing with Stripe Gateways...</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 flex items-center justify-center p-6 antialiased">
            <div className="max-w-md w-full bg-[#1e293b] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative">
                
                {/* Status Header */}
                <div className={`p-10 flex flex-col items-center border-b border-slate-800 ${verified ? 'bg-emerald-500/5' : 'bg-rose-500/5'}`}>
                    {verified ? (
                        <div className="w-20 h-20 bg-emerald-500 text-[#0f172a] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                    ) : (
                        <div className="w-20 h-20 bg-rose-500 text-[#0f172a] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                    )}

                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">
                        {verified ? "Transaction Verified" : "Payment Rejected"}
                    </h1>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                        Ref: {searchParams.get("payment_intent")?.slice(0, 18)}...
                    </p>
                </div>

                {/* Timeline / Progress Section */}
                <div className="p-8 space-y-6">
                    <div className="relative">
                        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-800"></div>
                        
                        {/* Timeline Step 1 */}
                        <div className="relative flex items-center gap-6 mb-6">
                            <div className="w-6 h-6 rounded-full bg-emerald-500 border-4 border-[#1e293b] z-10"></div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Step 01</p>
                                <p className="text-sm text-white font-bold">Stripe Authorization Success</p>
                            </div>
                        </div>

                        {/* Timeline Step 2 */}
                        <div className="relative flex items-center gap-6 mb-6">
                            <div className={`w-6 h-6 rounded-full border-4 border-[#1e293b] z-10 ${verified ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Step 02</p>
                                <p className="text-sm text-white font-bold">Database Record Updated</p>
                            </div>
                        </div>

                        {/* Timeline Step 3 (Redirect) */}
                        <div className="relative flex items-center gap-6">
                            <div className="w-6 h-6 rounded-full bg-sky-500 border-4 border-[#1e293b] z-10 animate-pulse"></div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Final Step</p>
                                <p className="text-sm text-sky-400 font-bold italic">Redirecting to Invoices in {countdown}s...</p>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate('/user/view-invoice')}
                        className="w-full bg-sky-500 hover:bg-sky-400 text-[#0f172a] font-black py-4 rounded-xl transition-all uppercase text-xs tracking-[0.2em] active:scale-95 shadow-lg shadow-sky-500/20"
                    >
                        Return to Panel
                    </button>
                </div>

                {/* Footer Brand */}
                <div className="bg-slate-900/50 py-4 border-t border-slate-800 text-center">
                    <p className="text-[9px] text-slate-600 uppercase font-black tracking-[3px]">
                        Global Freight Control System
                    </p>
                </div>
            </div>
        </div>
    );
}