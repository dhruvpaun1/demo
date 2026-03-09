import React, { useEffect, useState } from "react";
import { api } from "../axiosSetup";
import { API_ENDPOINT } from "../apiEndpoints";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./PdfGenerator";
import { useNavigate } from "react-router-dom";

// Standardizing consistent SVG Icons for a cleaner look
const Icons = {
    CreditCard: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM5 12a1 1 0 112 0 1 1 0 01-2 0zm5 0a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
        </svg>
    ),
    Check: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
    )
};

function ViewAllInvoiceForUser() {
    const [invoices, setInvoices] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get(API_ENDPOINT.getInvoiceForUser);
                if (res.data.success) {
                    setInvoices(res.data.results);
                } else {
                    setError(res.data.message);
                }
            } catch (error) {
                setError(error.response?.data?.message || "Server error");
            }
        })();
    }, []);

    const getStatusBadge = (status) => {
        if (status === "PAID") return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
        if (status === "UNPAID") return "bg-rose-500/10 text-rose-400 border border-rose-500/30";
        return "bg-slate-700 text-slate-300 border border-slate-600";
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 px-6 py-12">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Billing Center</h1>
                        <p className="text-slate-400 font-medium">Manage your shipment invoices and transaction history.</p>
                    </div>

                    <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl px-8 py-5 flex flex-col items-center md:items-end shadow-xl">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-1">Active Invoices</p>
                        <p className="text-3xl font-black text-sky-400 leading-none">{invoices.length}</p>
                    </div>
                </header>

                {error && (
                    <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl flex items-center gap-3 animate-pulse">
                        <span className="font-bold text-lg">!</span> {error}
                    </div>
                )}

                {invoices.length === 0 ? (
                    <div className="bg-[#1e293b] p-20 rounded-[2.5rem] border border-slate-800 text-center shadow-2xl">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">No invoices found</h2>
                        <p className="text-slate-500 max-w-sm mx-auto">When you process shipments, your billing documentation will appear here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {invoices.map((inv) => (
                            <div key={inv.id} className="group relative bg-[#1e293b] border border-slate-800 rounded-[2rem] p-8 shadow-2xl transition-all duration-500 hover:border-sky-500/40 hover:translate-y-[-6px] hover:shadow-sky-500/5 overflow-hidden">
                                {/* Subtle Background Glow */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-sky-500/5 rounded-full blur-[60px] -mt-20 -mr-20 transition-opacity duration-500 group-hover:opacity-100 opacity-40"></div>

                                {/* Top Section: ID & Badge */}
                                <div className="flex justify-between items-center mb-8 relative z-10">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Invoice Reference</p>
                                        <h3 className="text-xl font-black text-white group-hover:text-sky-400 transition-colors">#{inv.invoiceNumber}</h3>
                                    </div>
                                    <span className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-full tracking-tighter shadow-sm ${getStatusBadge(inv.status)}`}>
                                        {inv.status}
                                    </span>
                                </div>

                                {/* Main Data Section */}
                                <div className="space-y-5 bg-[#0f172a]/40 p-5 rounded-2xl border border-slate-800/50 mb-8 relative z-10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Package</span>
                                        <span className="text-sm font-bold text-slate-200">#{inv.package?.trackingNumber}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount Due</span>
                                        <span className="text-lg font-black text-white">${inv.packageCost+inv.deliveryCost}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dated</span>
                                        <span className="text-sm font-medium text-slate-400">{new Date(inv.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3 relative z-10">
                                    {inv.status !== "PAID" ? (
                                        <button 
                                            onClick={() => navigate(`/checkout/${inv.id}`)}
                                            className="w-full flex items-center justify-center gap-2 bg-sky-500 text-[#0f172a] py-4 rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-sky-400 hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-sky-500/20"
                                        >
                                            <Icons.CreditCard />
                                            Complete Payment
                                        </button>
                                    ) : (
                                        <div className="w-full py-4 flex items-center justify-center gap-2 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 rounded-xl text-[12px] font-black uppercase tracking-[0.2em]">
                                            <Icons.Check />
                                            Settled Successfully
                                        </div>
                                    )}

                                    <PDFDownloadLink
                                        document={<InvoicePDF invoice={inv} />}
                                        fileName={`Invoice_${inv.invoiceNumber}.pdf`}
                                        className="w-full flex items-center justify-center gap-2 bg-slate-800/50 text-slate-300 py-3 rounded-xl uppercase text-[10px] font-bold tracking-widest hover:bg-slate-700 hover:text-white transition-all border border-slate-700/50"
                                    >
                                        {({ loading }) => (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                {loading ? "Preparing..." : "Archive Copy (PDF)"}
                                            </>
                                        )}
                                    </PDFDownloadLink>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewAllInvoiceForUser;