import React, { useEffect, useState } from "react";
import { api } from "../axiosSetup";
import { API_ENDPOINT } from "../apiEndpoints";

function PackageManagementForUser() {
    // Core Data States
    const [packages, setPackages] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal & Form States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [packageData, setPackageData] = useState(null);
    const [address, setAddress] = useState("");
    const [username, setUsername] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Feedback States
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const fetchUserData = async () => {
        try {
            const [pkgRes, histRes] = await Promise.all([
                api.get(API_ENDPOINT.viewAssignedPackage),
                api.get(API_ENDPOINT.viewPackageHistoryForUser)
            ]);

            if (pkgRes.data.success) {
                setPackages(pkgRes.data.results || []);
            }
            if (histRes.data.success) {
                setHistory(histRes.data.results || []);
            }
        } catch (err) {
            console.error("User Fetch Error", err);
        } finally {
            setLoading(false);
        }
    };

    const scheduleDelivery = (id) => {
        const selected = packages.find((pk) => pk.id === id);
        setPackageData(selected);
        setAddress("");
        setError("");
        setMessage("");
        setIsModalOpen(true);
    };

    const sendScheduleDeliveryData = async (id) => {
        if (!address.trim()) {
            setError("Please provide a valid delivery address.");
            return;
        }

        try {
            setIsSubmitting(true);
            setError("");
            const res = await api.post(API_ENDPOINT.scheduleDelivery, {
                address,
                receiverName: username,
                packageId: id,
            });

            if (res.data.success) {
                setMessage("Delivery Scheduled Successfully!");
                fetchUserData();
                setTimeout(() => {
                    setIsModalOpen(false);
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Internal Server Error. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        fetchUserData();
        const interval = setInterval(fetchUserData, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (packageData?.User?.name) {
            setUsername(packageData.User.name);
        }
    }, [packageData]);

    if (loading)
        return (
            <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
                <div className="text-sky-500 font-mono text-xs tracking-[0.3em] animate-pulse">SYNCING LOGISTICS...</div>
            </div>
        );

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 lg:p-12">
            
            {/* --- SCHEDULE DELIVERY MODAL --- */}
            {isModalOpen && packageData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>

                    <div className="relative bg-[#1e293b] w-full max-w-md p-8 rounded-3xl border border-slate-700 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Confirm Delivery</h2>
                            <span className="text-sky-400 font-mono text-[10px] bg-sky-500/10 px-2 py-1 rounded border border-sky-500/20">{packageData.trackingNumber}</span>
                        </div>

                        {error && <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] rounded-lg font-bold border-l-4 border-l-rose-500">{error}</div>}
                        {message && <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] rounded-lg font-bold border-l-4 border-l-emerald-500">{message}</div>}

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 bg-[#0f172a]/50 p-4 rounded-2xl border border-slate-800">
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase">Item Cost</p>
                                    <p className="text-white font-bold text-sm">${packageData.itemCost}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase">Delivery Cost</p>
                                    <p className="text-white font-bold text-sm">$1</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase">Total Payable</p>
                                    <p className="text-sky-400 font-bold text-sm">${Number(packageData.itemCost) + 1}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Receiver Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-white text-sm outline-none focus:border-sky-500 transition-all"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Delivery Address *</label>
                                <textarea
                                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-white text-sm outline-none focus:border-sky-500 transition-all"
                                    rows="3"
                                    placeholder="House No, Street, Landmark..."
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>

                            <button
                                disabled={isSubmitting || message}
                                onClick={() => sendScheduleDeliveryData(packageData.id)}
                                className="w-full bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-500 text-[#0f172a] font-black py-4 rounded-2xl transition-all shadow-lg shadow-sky-500/10 uppercase text-xs tracking-widest mt-2">
                                {isSubmitting ? "Syncing..." : "Schedule Delivery"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto space-y-12">
                <header className="flex justify-between items-end border-b border-slate-800 pb-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">My Shipments</h1>
                        <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">Active Inventory</p>
                    </div>
                    <button onClick={fetchUserData} className="text-[10px] font-bold text-sky-500 border border-sky-500/30 px-3 py-1 rounded hover:bg-sky-500/10 transition-all">
                        REFRESH DATA
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.length > 0 ? (
                        packages.map((pk, index) => {
                            const isDelivered = pk.status === "Delivered to Customer";

                            return (
                                <div 
                                    key={pk.id} 
                                    className={`p-6 rounded-2xl border transition-all shadow-xl group relative overflow-hidden ${
                                        isDelivered 
                                        ? "bg-[#064e3b]/20 border-emerald-500/40 shadow-emerald-500/5" 
                                        : "bg-[#1e293b] border-slate-800 hover:border-sky-500/40"
                                    }`}
                                >
                                    {/* Success Watermark */}
                                    {isDelivered && (
                                        <div className="absolute -right-4 -top-4 opacity-10 rotate-12">
                                            <svg className="w-24 h-24 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                            </svg>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex flex-col">
                                            <span className={`${isDelivered ? "text-emerald-400" : "text-sky-400"} font-mono font-black text-lg tracking-tighter italic uppercase`}>
                                                {pk.tracking_number}
                                            </span>
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Serial: {index + 1}</span>
                                        </div>
                                        <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-tighter shadow-lg ${
                                            isDelivered 
                                            ? "bg-emerald-500 text-[#064e3b] shadow-emerald-500/20" 
                                            : "bg-sky-500 text-[#0f172a] shadow-sky-500/20"
                                        }`}>
                                            {isDelivered ? "✓ Delivered To Customer" : pk.status}
                                        </span>
                                    </div>

                                    <div className={`grid grid-cols-2 gap-4 border-t pt-4 ${isDelivered ? "border-emerald-500/10" : "border-slate-800/50"}`}>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Weight Metrics</p>
                                            <p className="text-white font-bold">{pk.weight} <span className="text-slate-500 text-[10px]">KG</span></p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Value</p>
                                            <p className="text-white font-bold"><span className="text-slate-500 text-[10px]">$</span>{pk.itemCost}</p>
                                        </div>
                                    </div>

                                    {pk.note && (
                                        <div className={`mt-4 p-3 rounded-lg border ${isDelivered ? "bg-emerald-500/5 border-emerald-500/10" : "bg-[#0f172a]/50 border-slate-700/50"}`}>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Administrative Note</p>
                                            <p className="text-xs text-slate-300 italic">"{pk.note}"</p>
                                        </div>
                                    )}

                                    <div className={`mt-4 p-3 rounded-lg border ${isDelivered ? "bg-emerald-500/5 border-emerald-500/10" : "bg-[#0f172a]/50 border-slate-700/50"}`}>
                                        <p className={`text-[9px] font-bold uppercase mb-1 ${isDelivered ? "text-emerald-500/60" : "text-slate-500"}`}>Attachments</p>
                                        {pk.attachment ? (
                                            <a href={`http://localhost:3001${pk.attachment}`} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-sky-400 hover:underline">
                                                View Attached Documentation
                                            </a>
                                        ) : (
                                            <p className="text-[10px] text-slate-500 italic">No manifests attached.</p>
                                        )}
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-slate-800/50">
                                        {isDelivered ? (
                                            <div className="w-full py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                                                <span className="text-emerald-500 font-black text-[11px] uppercase tracking-widest">Package Delivered</span>
                                            </div>
                                        ) : pk.status === "Delivered to Warehouse" && !pk.deliveryDetails ? (
                                            <button
                                                className="w-full py-4 bg-transparent border-2 border-sky-400 text-sky-400 font-black rounded-xl text-[11px] uppercase tracking-[0.2em] hover:bg-sky-400 hover:text-[#0f172a] transition-all duration-500 shadow-[inset_0_0_10px_rgba(56,189,248,0.2)]"
                                                onClick={() => scheduleDelivery(pk.id)}
                                            >
                                                Schedule Delivery
                                            </button>
                                        ) : (
                                            <div className="w-full py-4 bg-slate-800/40 border border-slate-700 rounded-xl flex items-center justify-center italic">
                                                <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">In Process</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-32 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                            <p className="text-slate-600 font-mono text-sm uppercase tracking-[0.4em]">Zero Active Signals Found</p>
                        </div>
                    )}
                </div>

                {/* History Section */}
                <section className="bg-[#1e293b]/50 p-8 rounded-3xl border border-slate-800">
                    <h2 className="text-xl font-black text-white mb-8 flex items-center gap-4 uppercase italic tracking-tighter">
                        <span className="h-2 w-2 bg-sky-500 rounded-full animate-ping shadow-[0_0_10px_#0ea5e9]"></span>
                        Transit Telemetry Log
                    </h2>

                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                        {history.length > 0 ? (
                            history.map((h, i) => (
                                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-800 bg-[#0f172a] text-sky-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                        <div className={`w-2 h-2 rounded-full ${h.newStatus.includes("Delivered") ? "bg-emerald-500 animate-pulse" : "bg-current"}`}></div>
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[45%] bg-[#1e293b] p-5 rounded-2xl border border-slate-800 shadow-xl group-hover:border-sky-500/30 transition-colors">
                                        <div className="flex justify-between items-center mb-2">
                                            <time className="font-mono text-[10px] font-bold text-sky-500/70 italic">{new Date(h.changed_at || h.created_at).toLocaleString()}</time>
                                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest font-mono">Log_{i+100}</span>
                                        </div>
                                        <p className="text-sm text-slate-300">
                                            Package <span className="text-sky-400 font-bold">#{h.package.trackingNumber}</span> status updated to
                                            <span className={`font-black uppercase ml-1 underline underline-offset-4 ${h.newStatus.includes("Delivered") ? "text-emerald-400 decoration-emerald-500/50" : "text-white decoration-sky-500/50"}`}> {h.newStatus}</span>
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-slate-600 text-xs font-mono uppercase italic py-10 tracking-widest">Awaiting First Telemetry Ping...</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default PackageManagementForUser;