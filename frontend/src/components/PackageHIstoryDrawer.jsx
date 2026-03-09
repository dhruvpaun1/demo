import React, {useEffect, useState} from "react";
import {api} from "../axiosSetup";
import {API_ENDPOINT} from "../apiEndpoints";

function PackageHistoryDrawer({packageId, isOpen, onClose, type = "package"}) {
	const [history, setHistory] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (isOpen && packageId) {
			fetchHistory();
		}
	}, [isOpen, packageId]);

	const fetchHistory = async () => {
		try {
			setLoading(true);
			const res =
				type === "package"
					? await api.post(API_ENDPOINT.getPackage, {
							packageId,
						})
					: await api.post(API_ENDPOINT.viewQueryStatusHistory, {
							queryId: packageId,
						});
			console.log(res);

			if (res.data.success) {
				setHistory(res.data.results);
			}
		} catch (err) {
			console.log("History fetch failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{/* Backdrop */}
			<div className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-40 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={onClose}></div>

			{/* Drawer */}
			<div
				className={`fixed top-0 right-0 h-full w-100 bg-[#1e293b] border-l border-slate-800 shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
				<div className="p-6 border-b border-slate-800 flex justify-between items-center">
					<h2 className="text-white font-bold text-lg uppercase tracking-widest">Status History</h2>
					<button onClick={onClose} className="text-slate-400 hover:text-white text-sm">
						Close ✕
					</button>
				</div>

				<div className="p-6 overflow-y-auto h-[calc(100%-70px)]">
					{loading ? (
						<p className="text-slate-400 text-sm">Loading history...</p>
					) : history.length === 0 ? (
						<p className="text-slate-500 italic text-sm">No history available.</p>
					) : (
						<div className="space-y-4">
							{history.map((entry, index) => (
								<div key={index} className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
									<div className="flex justify-between items-center">
										<span className="text-sky-400 font-bold text-xs uppercase">
											{entry.oldStatus} → {entry.newStatus}
										</span>
										<span className="text-[9px] text-slate-500">
											{type === "package" ?(
												new Date(entry.created_at).toLocaleString()
											):new Date(entry.createdAt).toLocaleString()}
											</span>
									</div>

									{entry.changedBy && (
										<p className="text-[10px] text-slate-400 mt-1">
											{type === "package" ? `Updated by Admin ${entry.User.name}` : `Updated by ${1|| entry.changedByUser.role === "admin" ? `Admin ${entry.changedByUser.name}` : "System"}`}
										</p>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</>
	);
}

export default PackageHistoryDrawer;
