import React, {useEffect, useState} from "react";
import {api} from "../axiosSetup";
import {API_ENDPOINT} from "../apiEndpoints";
import {useForm} from "react-hook-form";
import toast from "react-hot-toast";
import QueryChatDialog from "./ChatDialogForQuery";

function AddQueryForUser() {
	const [packages, setPackages] = useState(null);
	const [queries, setQueries] = useState(null);
	const [error, setError] = useState(null);
	const [message, setMessage] = useState(null);
	const [selectedQueryId,setSelectedQueryId]=useState(null)
	const [isOpen,setIsOpen]=useState(false)
	const {register, handleSubmit, reset} = useForm();
	const sendMessage = async (queryId) => {
		try {
			const res = await api.post(API_ENDPOINT.sendUserMessage, {
				queryId,
				message,
			});
			if (res.data.success) {
				toast.success("respond added successfully");
				await fetchQueries()
			}
		} catch (error) {}
	};
	const fetchQueries = async () => {
		try {
			const res = await api.get(API_ENDPOINT.viewAllUserQuery);
			if (res.data.success) {
				setQueries(res.data.results);
			}
		} catch (error) {
			if (error.response) {
				toast.error(error.response.data.message);
			} else {
				toast.error("Server error");
			}
		}
	};

	useEffect(() => {
		(async () => {
			try {
				const res = await api.get(API_ENDPOINT.viewAssignedPackage);
				if (res.data.success) {
					setPackages(res.data.results);
				}
			} catch (error) {
				if (error.response) {
					setError(error.response.data.message);
				} else {
					setError("Network error");
				}
			}
		})();
		fetchQueries();
	}, []);

	const reportNewQuery = async (data) => {
		try {
			setError(null);

			const formData = new FormData();
			formData.append("packageId", data.packageId);
			formData.append("notes", data.notes);

			if (data.attachment && data.attachment[0]) {
				formData.append("attachment", data.attachment[0]);
			}

			const res = await api.post(API_ENDPOINT.newPackageQuery, formData, {headers: {"Content-Type": "multipart/form-data"}});

			if (res.data.success) {
				toast.success(res.data.message);
				reset();
				fetchQueries(); // refresh queries
			} else {
				toast.error(res.data.message);
			}
		} catch (error) {
			if (error.response) {
				setError(error.response.data.message);
			} else {
				setError("Something went wrong");
			}
		}
	};

	return (
		<div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 lg:p-10">
			<div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* LEFT SIDE – ADD QUERY */}
				<div className="lg:col-span-1">
					<div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-xl sticky top-10">
						<h2 className="text-xl font-bold text-white mb-6 underline decoration-sky-500 underline-offset-8 text-center uppercase tracking-tighter">Report Package Query</h2>

						{error && <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] rounded-lg font-bold border-l-4 border-l-rose-500">{error}</div>}

						<form onSubmit={handleSubmit(reportNewQuery)} className="space-y-4">
							{/* Package Select */}
							<div>
								<label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Select Package *</label>

								<select
									defaultValue=""
									{...register("packageId", {required: true})}
									className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2 text-white text-sm outline-none focus:border-sky-500">
									<option value="">Select Package...</option>
									{packages && packages.length > 0 ? (
										packages.map((pk) => (
											<option key={pk.id} value={pk.id} className="bg-[#1e293b]">
												{pk.trackingNumber}
											</option>
										))
									) : (
										<option disabled>No package available</option>
									)}
								</select>
							</div>

							{/* Notes */}
							<div>
								<label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Issue Description *</label>

								<textarea
									rows="3"
									{...register("notes", {required: true})}
									className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2 text-white text-sm outline-none focus:border-sky-500"
									placeholder="Describe the issue..."
								/>
							</div>

							{/* Attachment */}
							<div>
								<label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 italic">Attachment (Optional)</label>

								<input
									type="file"
									{...register("attachment")}
									className="w-full bg-[#0f172a] border border-slate-700/50 rounded-lg p-2 text-white text-[10px] outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-sky-500/10 file:text-sky-500 hover:file:bg-sky-500/20"
								/>
							</div>

							<button type="submit" className="w-full bg-sky-500 hover:bg-sky-400 text-[#0f172a] font-black py-3 rounded-xl transition-all shadow-lg uppercase text-xs tracking-widest active:scale-95">
								Submit Query
							</button>
						</form>
					</div>
				</div>

				{/* RIGHT SIDE – QUERY LIST */}
				<div className="lg:col-span-2 bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
					<div className="p-6 border-b border-slate-800 bg-slate-800/30">
						<h2 className="text-xl font-bold text-white tracking-tighter">My Package Queries</h2>
					</div>

					<div className="divide-y divide-slate-800">
						{queries && queries.length > 0 ? (
							queries.map((qr, index) => (
								<div key={qr.id} className="p-6 hover:bg-slate-800/40 transition-colors space-y-4">
									{/* Header */}
									<div className="flex justify-between items-center">
										<div className="text-sky-400 font-mono font-black text-sm">Query : {index + 1}</div>

										<span
											className={`px-3 py-1 rounded text-[9px] font-black uppercase border
          ${
											qr.status === "Resolved"
												? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
												: qr.status === "Processing"
													? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
													: qr.status === "Respond"
														? "bg-orange-500/10 border-orange-500/30 text-orange-400"
														: qr.status === "Customer Respond"
															? "bg-purple-500/10 border-purple-500/30 text-purple-400"
															: "bg-sky-500/10 border-sky-500/30 text-sky-400"
										}`}>
											{qr.status}
										</span>
									</div>

									{/* User Message */}
									<div className="bg-slate-900/40 p-4 rounded-xl border border-slate-700">
										<p className="text-slate-400 text-xs font-semibold mb-1">Your Message</p>
										<p className="text-slate-300 text-sm italic">{qr.notes}</p>
									</div>
									<button
										onClick={() => {
											setSelectedQueryId(qr.id);
											setIsOpen(true);
										}}
										className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-[#0f172a] font-bold text-xs uppercase tracking-widest rounded-lg transition active:scale-95">
										View Progress
									</button>
									{/* Show Input ONLY when status is Respond */}
									{qr.status === "Respond" && (
										<div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 space-y-3">
											<input
												type="text"
												placeholder="Write your reply..."
												onChange={(e) => setMessage(e.target.value)}
												className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2 text-white text-sm outline-none focus:border-sky-500"
											/>

											<button
												onClick={() => sendMessage(qr.id)}
												className="w-full bg-sky-500 hover:bg-sky-400 text-[#0f172a] font-bold py-2 rounded-lg transition-all active:scale-95 text-xs uppercase tracking-wider">
												Send Reply
											</button>
										</div>
									)}
								</div>
							))
						) : (
							<div className="p-10 text-center text-slate-500 italic text-sm">No queries reported.</div>
						)}
					</div>
				</div>
				<QueryChatDialog isOpen={isOpen} queryId={selectedQueryId} onClose={() => setIsOpen(false)} role="user" />
			</div>
		</div>
	);
}

export default AddQueryForUser;
