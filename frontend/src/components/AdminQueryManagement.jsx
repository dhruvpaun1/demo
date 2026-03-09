import React from "react";
import {useEffect} from "react";
import {useState} from "react";
import toast from "react-hot-toast";
import {api} from "../axiosSetup";
import {API_ENDPOINT} from "../apiEndpoints";
import PackageHistoryDrawer from "./PackageHIstoryDrawer";
import {cutomerQueryStatuses, statusOptions} from "../constants/statuses";
import {Link} from "react-router-dom";
import QueryChatDialog from "./ChatDialogForQuery";

function AdminQueryManagement() {
	const [queries, setQueries] = useState(null);
	const [isOpen, setIsOpen] = useState(false);
	const [packageId, setPackageId] = useState(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [packageQueryHistoryId, setPackageQueryHIstoryId] = useState();
	const [isStatusHistoryOpen, setIsStatusHistoryOpen] = useState(false);
	const [selectedQueryId, setSelectedQueryId] = useState(null);
	const [adminMessage, setAdminMessage] = useState("");
	const sendAdminMessage = async () => {
		try {
			const res = await api.post(API_ENDPOINT.sendAdminMessage, {
				queryId: selectedQueryId,
				message: adminMessage,
			});

			if (res.data.success) {
				toast.success("Response sent successfully");
				setAdminMessage("");
				setIsDialogOpen(false);
				viewAllQueries();
			} else {
				toast.error(res.data.message);
			}
		} catch (error) {
			toast.error("Server error");
		}
	};

	const changeStatus = async (newStatus, queryId) => {
		try {
			const res = await api.put(API_ENDPOINT.changeStatus, {
				queryId,
				newStatus: newStatus,
			});
			if (res.data.success) {
				toast.success(res.data.message);
				viewAllQueries();
			} else {
				toast.error(res.data.message);
			}
		} catch (error) {
			if (error.response) {
				toast.error(error.response.data.message);
			} else {
				toast.error("Server error");
			}
		}
	};
	const viewAllQueries = async () => {
		try {
			const res = await api.get(API_ENDPOINT.viewAllAdminQueries);
			if (res.data.success) {
				console.log(res.data.results);

				setQueries(res.data.results);
			} else {
				toast.error(res.data.message);
			}
		} catch (error) {
			if (error.response) {
				toast.error(error.response.data.message);
			}
		}
	};
	useEffect(() => {
		viewAllQueries();
	}, []);
	return (
		<div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 lg:p-10">
			<div className="max-w-7xl mx-auto bg-[#1e293b] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
				{/* Header */}
				<div className="p-6 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
					<h2 className="text-xl font-bold text-white tracking-tighter uppercase">Admin Query Management</h2>

					<div className="text-xs text-slate-400 uppercase tracking-widest">Total: {queries ? queries.length : 0}</div>
				</div>

				{/* Content */}
				<div className="divide-y divide-slate-800">
					{queries && queries.length > 0 ? (
						queries.map((qr, index) => (
							<div key={qr.id} className="p-6 hover:bg-slate-800/40 transition-colors">
								<div className="flex justify-between items-start mb-4">
									{/* Left Info */}
									<div>
										<div className="text-sky-400 font-mono font-black text-sm">{index + 1}.</div>

										<div className="mt-2 text-xs text-slate-400 uppercase tracking-widest">User name: {qr.customer.name}</div>

										<div className="text-xs text-slate-500 uppercase tracking-widest">Package Tracking Number : {qr.package.trackingNumber}</div>
									</div>

									{/* Status Badge */}
									<select
										onChange={(e) => changeStatus(e.target.value, qr.id)}
										value={qr.status}
										className="bg-[#0f172a] border border-slate-700 text-slate-200 text-xs font-bold tracking-widest px-3 py-2 rounded-lg outline-none focus:border-sky-500 transition">
										{cutomerQueryStatuses.map((st) => (
											<option key={st} value={st} className="bg-[#1e293b] text-slate-200">
												{st}
											</option>
										))}
									</select>
								</div>

								{/* Notes */}
								<div className="text-sm text-slate-300 italic border-l-2 border-sky-500 pl-4">{qr.notes}</div>

								{/* Action Buttons */}
								<div className="mt-5 flex gap-3">
									<button
										onClick={() => {
											setSelectedQueryId(qr.id);
											setIsOpen(true);
										}}
										className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-[#0f172a] font-bold text-xs uppercase tracking-widest rounded-lg transition active:scale-95">
										View Progress
									</button>
									<button
										onClick={() => {
											setPackageQueryHIstoryId(qr.id);
											setIsStatusHistoryOpen(true);
										}}
										className="text-sky-500 text-[9px] font-black uppercase tracking-widest border border-sky-500/20 px-3 py-1.5 rounded-lg hover:bg-sky-500 hover:text-[#0f172a] transition-all">
										View Status history
									</button>

									{qr.attachment && (
										<Link
											to={`http://localhost:3001${qr.attachment}`}
											className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-[#0f172a] font-bold text-xs uppercase tracking-widest rounded-lg transition active:scale-95">
											View Attachment
										</Link>
									)}

									<button
										disabled={!["Submitted", "Processing"].includes(qr.status)}
										onClick={() => {
											setSelectedQueryId(qr.id);
											setIsDialogOpen(true);
										}}
										className={`px-4 py-2 text-xs uppercase tracking-widest rounded-lg transition active:scale-95 font-bold
    ${["Submitted", "Processing"].includes(qr.status) ? "bg-sky-500 hover:bg-sky-400 text-[#0f172a]" : "bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed"}`}>
										Send Response
									</button>
								</div>
							</div>
						))
					) : (
						<div className="p-10 text-center text-slate-500 italic text-sm">No queries available.</div>
					)}
				</div>
				{isDialogOpen && (
					<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
						<div className="bg-[#1e293b] w-full max-w-md rounded-2xl border border-slate-800 shadow-2xl p-6 space-y-4">
							<h3 className="text-white font-bold uppercase tracking-widest text-sm">Send Response</h3>

							<textarea
								rows="4"
								placeholder="Write your response..."
								value={adminMessage}
								onChange={(e) => setAdminMessage(e.target.value)}
								className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white text-sm outline-none focus:border-sky-500"
							/>

							<div className="flex justify-end gap-3">
								<button
									onClick={() => {
										setIsDialogOpen(false);
										setAdminMessage("");
									}}
									className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-xs uppercase font-bold rounded-lg">
									Cancel
								</button>

								<button
									onClick={sendAdminMessage}
									disabled={!adminMessage}
									className="px-4 py-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#0f172a] text-xs uppercase font-bold rounded-lg">
									Send
								</button>
							</div>
						</div>
					</div>
				)}
				<QueryChatDialog isOpen={isOpen} queryId={selectedQueryId} onClose={() => setIsOpen(false)} role="admin" />
				<PackageHistoryDrawer isOpen={isStatusHistoryOpen} packageId={packageQueryHistoryId} onClose={() => setIsStatusHistoryOpen(false)} type="query" />
			</div>
		</div>
	);
}

export default AdminQueryManagement;
