import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { api } from "../axiosSetup";
import { API_ENDPOINT } from "../apiEndpoints";

function ViewHistory() {
    const { role } = useSelector((state) => state.auth);
    const [history, setHistory] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const endpoint = role === "admin" ? API_ENDPOINT.viewPackageHistoryForAdmin : API_ENDPOINT.viewPackageHistoryForUser;
            
            const res = await api.get(endpoint);
            
            if (res.data.success) {
                const logs = res.data.results || res.data.data || [];
                setHistory(logs);
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError("Failed to reach the audit server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [role]); 

    if (loading) return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
            <div className="text-sky-500 font-mono text-xs tracking-[0.4em] animate-pulse">RETRIEVING AUDIT LOGS...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 lg:p-12">
            <div className="max-w-6xl mx-auto">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                            {role === "admin" ? "Global Audit Trail" : "My Shipment Logs"}
                        </h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                            {role === "admin" ? "System-wide status transitions" : "History of your package movements"}
                        </p>
                    </div>
                    <button 
                        onClick={fetchHistory}
                        className="bg-sky-500/10 text-sky-500 border border-sky-500/20 px-6 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-sky-500 hover:text-[#0f172a] transition-all"
                    >
                        Refresh Logs
                    </button>
                </div>

                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl mb-6 text-sm font-bold">
                        {error}
                    </div>
                )}

                <div className="bg-[#1e293b] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900/50 text-[10px] uppercase font-black text-slate-500 tracking-widest border-b border-slate-800">
                                    <th className="px-6 py-5">Event Number</th>
                                    <th className="px-6 py-5">Package Ref</th>
                                    <th className="px-6 py-5">Status Transition</th>
                                    <th className="px-6 py-5">Modified By</th>
                                    <th className="px-6 py-5 text-right">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {history && history.length > 0 ? (
                                    history.map((log,index) => (
                                        <tr key={log.id} className="hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                               {index+1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sky-400 font-black text-sm tracking-tighter">
                                                    {log?.package?.trackingNumber}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-bold text-slate-500 line-through opacity-50">{log.oldStatus}</span>
                                                    <span className="text-sky-500 text-xs">→</span>
                                                    <span className="px-2 py-0.5 bg-sky-500 text-[#0f172a] text-[9px] font-black rounded uppercase">
                                                        {log.newStatus}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-400">
                                                {role === "admin" ? `Admin UID: ${log.User.name}` : "System Update"}
                                            </td>
                                            <td className="px-6 py-4 text-right text-[10px] font-mono text-slate-500">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center">
                                            <p className="text-slate-600 font-mono text-xs uppercase tracking-[0.2em]">No historical data found in current partition.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <footer className="mt-8 flex justify-between items-center px-2">
                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">End of Audit Log</p>
                    <div className="h-px flex-1 bg-slate-800 mx-4"></div>
                    <p className="text-[9px] font-bold text-sky-500/50 uppercase tracking-widest">Fleet Logistics SecOps</p>
                </footer>
            </div>
        </div>
    );
}

export default ViewHistory;