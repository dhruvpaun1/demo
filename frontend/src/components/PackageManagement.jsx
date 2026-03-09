import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {api} from "../axiosSetup";
import {API_ENDPOINT} from "../apiEndpoints";
import * as xlsx from "xlsx";
import {statusOptions} from "../constants/statuses";
import PackageHistoryDrawer from "./PackageHIstoryDrawer";

function PackageManagement() {
	const [packages, setPackages] = useState([]);
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const [editingId, setEditingId] = useState(null);
	const [editStatus, setEditStatus] = useState("");
	const [historyPackageId,setHistoryPackageId]=useState(null)
	const [isOpen,setIsOpen]=useState(false)

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: {errors},
	} = useForm({
		defaultValues: {
			status: "",
			note: "",
			attachment: "",
			tracking_number: "",
			weight: "",
			item_cost: "",
			user_id: "",
		},
	});

	const exportData = async () => {
		const workSheetData = packages.map((pkg) => ({
			Tracking_number: pkg.trackingNumber,
			Weight: pkg.weight,
			item_cost: pkg.itemCost,
			"Assigned to": pkg.userId,
			"Package id": pkg.id,
			Note: pkg.note,
			Status: pkg.status,
			"Date Created": new Date(pkg.created_at).toLocaleDateString(),
			"Attachment Link": pkg.attachment ? `http://localhost:3001${pkg.attachment}` : "No Attachment",
		}));
		const workSheet = xlsx.utils.json_to_sheet(workSheetData);
		const workBook = xlsx.utils.book_new();
		xlsx.utils.book_append_sheet(workBook, workSheet, "Shipments Details");
		xlsx.writeFile(workBook, `Shipment_report_${new Date().toLocaleDateString()}.xlsx`);
	};

	const fetchData = async () => {
		try {
			const [pkgRes, userRes] = await Promise.all([api.get(API_ENDPOINT.viewAdminPackages), api.get(API_ENDPOINT.getAllUsers)]);
			if (pkgRes.data.success) setPackages(pkgRes.data.results);
			if (userRes.data.success) setUsers(userRes.data.results);
		} catch (err) {
			setError("Package Sync Failed");
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const generateTracking = () => {
		const code = "FLT-" + Math.random().toString(36).toUpperCase().substring(2, 10);
		setValue("tracking_number", code);
	};

	const onSubmit = async (data) => {
		try {
			setLoading(true);
			setError(null);
			const formData = new FormData();
			formData.append("user_id", data.user_id);
			formData.append("tracking_number", data.tracking_number);
			formData.append("weight", data.weight);
			formData.append("item_cost", data.item_cost);
			formData.append("status", data.status);
			formData.append("note", data.note);
			if (data.attachment && data.attachment[0]) {
				formData.append("attachment", data.attachment[0]);
			}
			const res = await api.post(API_ENDPOINT.addPackage, formData, {
				headers: {"Content-Type": "multipart/form-data"},
			});

			if (res.data.success) {
				reset({status: "pending", note: "", attachment: "", tracking_number: "", weight: "", item_cost: "", user_id: ""});
				fetchData();
			}
		} catch (err) {
			const serverMessage = err.response?.data?.message || "Database Insertion Error";
			setError(serverMessage);
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateStatus = async (id) => {
		try {
			const res = await api.put(API_ENDPOINT.editStatusForPackage(id), {newStatus: editStatus});
			if (res.data.success) {
				setEditingId(null);
				fetchData();
			}
		} catch (err) {
			alert("Update Failed");
		}
	};

	return (
		<div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 lg:p-10">
			<div className="max-w-400 mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
				<div className="lg:col-span-1">
					<div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-xl lg:sticky lg:top-10">
						<h2 className="text-xl font-bold text-white mb-6 underline decoration-sky-500 underline-offset-8 text-center uppercase tracking-tighter">New Freight Packages</h2>

						{error && <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] rounded-lg font-bold border-l-4 border-l-rose-500">{error}</div>}

						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div>
								<label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tracking Number *</label>
								<div className="flex gap-2">
									<input
										{...register("tracking_number", {required: true})}
										className={`flex-1 bg-[#0f172a] border ${errors.tracking_number ? "border-rose-500" : "border-slate-700"} rounded-lg p-2 text-white text-sm outline-none focus:border-sky-500`}
										placeholder="TRK-0000"
									/>
									<button
										type="button"
										onClick={generateTracking}
										className="bg-sky-500/10 text-sky-500 border border-sky-500/20 px-3 rounded-lg text-[10px] font-bold hover:bg-sky-500 hover:text-[#0f172a] transition-all uppercase">
										Auto
									</button>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Owner *</label>
									<select
										{...register("user_id", {required: true})}
										className={`w-full bg-[#0f172a] border ${errors.user_id ? "border-rose-500" : "border-slate-700"} rounded-lg p-2 text-white text-sm outline-none cursor-pointer`}>
										<option value="">Select Account...</option>
										{users.map((u) => (
											<option key={u.id} value={u.id} disabled={u.status === "inactive"} className={u.status === "inactive" ? "text-slate-600 italic bg-slate-900" : "text-white bg-[#1e293b]"}>
												{u.name} {u.status === "inactive" ? "— (Inactive)" : ""}
											</option>
										))}
									</select>
								</div>
								<div>
									<label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Status *</label>
									<select {...register("status", {required: true})} className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2 text-white text-sm outline-none">
										{statusOptions.map((opt) => (
											<option key={opt} value={opt} className="bg-[#1e293b]">
												{opt}
											</option>
										))}
									</select>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Weight (KG) *</label>
									<input
										{...register("weight", {required: true})}
										type="number"
										step="0.01"
										className={`w-full bg-[#0f172a] border ${errors.weight ? "border-rose-500" : "border-slate-700"} rounded-lg p-2 text-white text-sm outline-none`}
										placeholder="0.00"
									/>
								</div>
								<div>
									<label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cost ($) *</label>
									<input
										{...register("item_cost", {required: true})}
										type="number"
										className={`w-full bg-[#0f172a] border ${errors.item_cost ? "border-rose-500" : "border-slate-700"} rounded-lg p-2 text-white text-sm outline-none`}
										placeholder="0"
									/>
								</div>
							</div>

							<div>
								<label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Note / Description *</label>
								<textarea
									{...register("note", {required: true})}
									rows="2"
									className={`w-full bg-[#0f172a] border ${errors.note ? "border-rose-500" : "border-slate-700"} rounded-lg p-2 text-white text-sm outline-none`}
									placeholder="Required details..."></textarea>
							</div>

							<div>
								<label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 italic">Attachment (Image/PDF)</label>
								<input
									{...register("attachment")}
									type="file"
									className="w-full bg-[#0f172a] border border-slate-700/50 rounded-lg p-2 text-white text-[10px] outline-none italic file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-sky-500/10 file:text-sky-500 hover:file:bg-sky-500/20"
								/>
							</div>

							<button
								disabled={loading}
								className="w-full bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 text-[#0f172a] font-black py-3 rounded-xl transition-all shadow-lg uppercase text-xs tracking-widest active:scale-95 mt-4">
								{loading ? "Verifying Packages..." : "Commit To Database"}
							</button>
						</form>
					</div>
				</div>

				<div className="lg:col-span-2 bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
					<div className="p-6 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center flex-wrap gap-4">
						<h2 className="text-xl font-bold text-white tracking-tighter">Global Inventory Control</h2>
						<div className="flex gap-2">
							<button
								onClick={exportData}
								className="text-[10px] bg-sky-500/10 text-sky-500 px-4 py-2 rounded-full border border-sky-500/20 font-bold uppercase tracking-widest hover:bg-sky-500 hover:text-white transition-all">
								Export Spreadsheet
							</button>
							<span className="text-[10px] bg-sky-500/10 text-sky-500 px-4 py-2 rounded-full border border-sky-500/20 font-bold uppercase tracking-widest">Live Inventory: {packages.length}</span>
						</div>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full text-left">
							<thead className="bg-slate-900/50 text-[10px] uppercase font-black text-slate-500 tracking-widest">
								<tr>
									<th className="px-6 py-4">Tracking & Owner</th>
									<th className="px-6 py-4">Freight Details</th>
									<th className="px-6 py-4">Status</th>
									<th className="px-6 py-4">Attachments</th>
									<th className="px-6 py-4 text-right">Operations</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-800">
								{packages.length === 0 ? (
									<tr>
										<td colSpan="5" className="px-6 py-10 text-center text-slate-500 italic text-sm">
											No inventory records found.
										</td>
									</tr>
								) : (
									packages.map((pk) => (
										<tr key={pk.id} className="hover:bg-slate-800/40 transition-colors">
											<td className="px-6 py-4">
												<div className="text-sky-400 font-mono font-black text-sm">{pk.trackingNumber}</div>
												<div className="text-[9px] text-slate-500 font-bold uppercase mt-1">assigned to : {pk.User.name}</div>
											</td>
											<td className="px-6 py-4 text-xs font-medium">
												<div className="text-white font-bold">
													{pk.weight} KG • ${pk.itemCost}
												</div>
												<div className="text-slate-500 truncate max-w-37.5 italic">"{pk.note}"</div>
											</td>

											<td className="px-6 py-4">
												{editingId === pk.id ? (
													<select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="bg-[#0f172a] border border-sky-500 rounded p-1 text-[10px] text-white outline-none">
														{statusOptions.map((opt) => (
															<option key={opt} value={opt} className="bg-[#1e293b]">
																{opt}
															</option>
														))}
													</select>
												) : (
													<span className="px-3 py-1 rounded text-[9px] font-black uppercase bg-slate-900 border border-slate-700 text-slate-300">{pk.status}</span>
												)}
											</td>

											<td className="px-6 py-4">
												{pk.attachment ? (
													<a
														href={`http://localhost:3001${pk.attachment}`}
														target="_blank"
														rel="noreferrer"
														className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-bold text-[9px] uppercase tracking-tighter bg-sky-500/5 p-2 rounded-lg border border-sky-500/10">
														<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
															/>
														</svg>
														View File
													</a>
												) : (
													<span className="text-[9px] text-slate-600 italic">No File</span>
												)}
											</td>

											<td className="px-6 py-4 text-right flex">
												{editingId === pk.id ? (
													<div className="flex justify-end gap-3 font-black text-[9px] uppercase">
														<button onClick={() => handleUpdateStatus(pk.id)} className="text-emerald-500 hover:text-emerald-400">
															Commit
														</button>
														<button onClick={() => setEditingId(null)} className="text-rose-500 hover:text-rose-400">
															Cancel
														</button>
													</div>
												) : (
													<button
														onClick={() => {
															setEditStatus(pk.status);
															setEditingId(pk.id);
														}}
														className="text-sky-500 text-[9px] font-black uppercase tracking-widest border border-sky-500/20 px-3 py-1.5 rounded-lg hover:bg-sky-500 hover:text-[#0f172a] transition-all">
														Update
													</button>
												)}
												<button
													onClick={() => {
														setHistoryPackageId(pk.id)
														setIsOpen(true)
													}}
													className="text-sky-500 text-[9px] font-black uppercase tracking-widest border border-sky-500/20 px-3 py-1.5 rounded-lg hover:bg-sky-500 hover:text-[#0f172a] transition-all">
													View Status history
												</button>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<PackageHistoryDrawer
			isOpen={isOpen} packageId={historyPackageId} onClose={()=>setIsOpen(false)}
			/>
		</div>
	);
}

export default PackageManagement;
