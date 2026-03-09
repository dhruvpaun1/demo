import React, {useEffect, useState} from "react";
import {api} from "../axiosSetup";
import {API_ENDPOINT} from "../apiEndpoints";
import {useForm, Controller} from "react-hook-form";
import Select from "react-select";
import {Link, NavLink} from "react-router-dom";
import toast from "react-hot-toast";

function ViewAllManifests() {
	const [manifests, setManifests] = useState([]);
	const [error, setError] = useState(null);

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: {errors, isSubmitting},
	} = useForm();

	const viewAllManifests = async () => {
		const res = await api.get(API_ENDPOINT.viewAllManifest);
		if (res.data.success) {
			setManifests(res.data.results);
		}
	};

	const addManifest = async (data) => {
		try {
			const manifestName = data.manifestName;
			console.log(manifestName);

			const res = await api.post(API_ENDPOINT.createManifest, {
				manifestName,
			});
			console.log(res);

			if (res.data.success) {
				viewAllManifests();
				toast.success(res.data.message);
			} else {
				setError(res.data.message);
				toast.error(res.data.message);
			}
		} catch (error) {
			if(error.response)
			{
				toast.error(error.response.data.message)
			}else{
				toast.error("network error")
			}
		}
	};
	const deleteManifest = async (id) => {
		const res = await api.delete(API_ENDPOINT.deleteManifest, {
			data: {
				manifestId: id,
			},
		});
		if (res.data.success) {
			viewAllManifests();
		} else {
			setError(res.data.message);
		}
	};

	useEffect(() => {
		viewAllManifests();
	}, []);

	return (
		<div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 lg:p-10">
			<div className="max-w-400 mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
				<div className="lg:col-span-1">
					<div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-xl lg:sticky lg:top-10">
						<h2 className="text-xl font-bold text-white mb-6 underline decoration-sky-500 underline-offset-8 text-center uppercase tracking-tighter">Create Manifest</h2>

						{error && <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] rounded-lg font-bold">{error}</div>}

						<form onSubmit={handleSubmit(addManifest)} className="space-y-4">
							<div>
								<label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Manifest Name *</label>
								<input
									{...register("manifestName", {required: true})}
									className={`w-full bg-[#0f172a] border ${errors.manifestName ? "border-rose-500" : "border-slate-700"} rounded-lg p-2 text-white text-sm outline-none`}
								/>
							</div>

							<button type="submit" disabled={isSubmitting} className="w-full bg-sky-500 hover:bg-sky-400 text-[#0f172a] font-black py-3 rounded-xl transition-all uppercase text-xs tracking-widest">
								Create Manifest
							</button>
						</form>
					</div>
				</div>
				<div className="lg:col-span-2 bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
					<div className="p-6 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
						<h2 className="text-xl font-bold text-white tracking-tighter">Manifest Inventory</h2>
						<span className="text-[10px] bg-sky-500/10 text-sky-500 px-4 py-2 rounded-full border border-sky-500/20 font-bold uppercase tracking-widest">Total: {manifests.length}</span>
					</div>

					<table className="w-full text-left">
						<thead className="bg-slate-900/50 text-[10px] uppercase font-black text-slate-500 tracking-widest">
							<tr>
								<th className="px-6 py-4">Manifest</th>
								<th className="px-6 py-4">Created By</th>
								<th className="px-6 py-4">Created At</th>
								<th className="px-6 py-4 text-right">Action</th>
							</tr>
						</thead>

						<tbody className="divide-y divide-slate-800">
							{manifests.length === 0 ? (
								<tr>
									<td colSpan="4" className="px-6 py-10 text-center text-slate-500 italic">
										No manifests created yet
									</td>
								</tr>
							) : (
								manifests.map((man) => (
									<tr key={man.id} className="hover:bg-slate-800/40 transition">
										<td className="px-6 py-4">
											<div className="text-sky-400 font-black text-sm">{man.manifestName.toUpperCase()}</div>
										</td>
										<td className="px-6 py-4 text-xs font-bold">Admin {man.creator.name}</td>
										<td className="px-6 py-4 text-xs text-slate-400">{new Date(man.created_at).toLocaleDateString()}</td>
										<td className="px-6 py-4 text-right">
											<NavLink
												to={`/admin/manifests/${man.id}`}
												className="text-sky-500 text-[9px] font-black uppercase tracking-widest border border-sky-500/20 px-3 py-1.5 rounded-lg hover:bg-sky-500 hover:text-[#0f172a] transition-all">
												View Packages
											</NavLink>
											<button
												onClick={(e) => {
													deleteManifest(e.target.value);
												}}
												value={man.id}
												className="text-sky-500 text-[9px] font-black uppercase tracking-widest border border-sky-500/20 px-3 py-1.5 rounded-lg hover:bg-sky-500 hover:text-[#0f172a] transition-all">
												Delete Manifest
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
	);
}

export default ViewAllManifests;
