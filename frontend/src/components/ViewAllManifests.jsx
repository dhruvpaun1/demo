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
			if (error.response) {
				toast.error(error.response.data.message);
			} else {
				toast.error("network error");
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
		<div className="min-h-screen bg-[#020617] text-slate-200 p-6 lg:p-12">
			<div className="max-w-7xl mx-auto space-y-12">
				{/* 1. Create Manifest Section (Adder) */}
				<section className="w-full flex justify-center">
					<div className="w-full bg-[#1e293b]/40 backdrop-blur-sm p-8 rounded-3xl border border-slate-800 shadow-2xl">
						<div className="flex items-center gap-3 mb-8">
							<div className="h-8 w-1 bg-sky-500 rounded-full"></div>
							<h2 className="text-2xl font-black text-white uppercase tracking-tight">Create Manifest</h2>
						</div>

						<form onSubmit={handleSubmit(addManifest)} className="space-y-5">
							<div className="relative group">
								<label className="absolute -top-2.5 left-4 bg-[#0f172a] px-2 text-[10px] font-bold text-sky-500 uppercase tracking-widest z-10">Manifest Identity</label>
								<input
									{...register("manifestName", {required: true})}
									placeholder="Enter unique manifest name..."
									className={`w-full bg-[#020617] border-2 ${
										errors.manifestName ? "border-rose-500/50" : "border-slate-800 focus:border-sky-500/50"
									} rounded-2xl p-5 text-white text-base outline-none transition-all placeholder:text-slate-600`}
								/>
							</div>

							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-5 rounded-2xl transition-all uppercase text-sm tracking-[0.2em] shadow-[0_0_20px_rgba(14,165,233,0.2)] active:scale-[0.99]">
								{isSubmitting ? "Generating..." : "Initialize Manifest"}
							</button>
						</form>
					</div>
				</section>

				{/* 2. Adaptive Card Grid */}
				<section>
					<div className="flex items-end justify-between mb-10 px-2">
						<div>
							<h2 className="text-3xl font-black text-white tracking-tighter">INVENTORY</h2>
							<p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Live Database Records</p>
						</div>
						<div className="flex flex-col items-end">
							<span className="text-[10px] text-slate-500 font-bold uppercase mb-1">Active Logs</span>
							<span className="text-lg font-black text-sky-500">{manifests.length}</span>
						</div>
					</div>

					{manifests.length === 0 ? (
						<div className="w-full py-32 text-center bg-[#1e293b]/20 rounded-3xl border-2 border-dashed border-slate-800/50 text-slate-500">
							<p className="text-sm font-bold uppercase tracking-widest">No Manifests Found</p>
							<p className="text-xs mt-2 opacity-50">Create your first entry above to populate this view.</p>
						</div>
					) : (
						<div className="flex flex-wrap gap-8">
							{manifests.map((man) => (
								<div
									key={man.id}
									className="group relative bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-slate-800/60 rounded-[2rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-sky-500/30 flex-grow basis-full md:basis-[calc(50%-1rem)] lg:basis-[calc(33.333%-2rem)]">
									{/* Top Badge Overlay */}
									<div className="absolute top-6 right-8">
										<div className="h-2 w-2 rounded-full bg-sky-500 animate-pulse shadow-[0_0_10px_#0ea5e9]"></div>
									</div>

									<div className="flex flex-col h-full">
										{/* Manifest Info */}
										<div className="mb-8">
											<h3 className="text-2xl font-black text-white group-hover:text-sky-400 transition-colors leading-tight">{man.manifestName?.toUpperCase()}</h3>
											<div className="mt-4 flex items-center gap-4">
												<div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-sky-500 font-black text-xs border border-slate-700">
													{man.creator?.name?.substring(0, 2).toUpperCase()}
												</div>
												<div>
													<p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Created By</p>
													<p className="text-sm font-bold text-slate-300">Admin {man.creator?.name}</p>
												</div>
											</div>
										</div>

										{/* Visual Divider */}
										<div className="w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-6"></div>

										{/* Metadata */}
										<div className="mb-8 flex justify-between items-center bg-[#020617]/40 p-4 rounded-2xl">
											<div className="text-center flex-1 border-r border-slate-800">
												<p className="text-[9px] font-black text-slate-500 uppercase">Timestamp</p>
												<p className="text-[11px] font-bold text-slate-400">{new Date(man.created_at).toLocaleDateString()}</p>
											</div>
											<div className="text-center flex-1">
												<p className="text-[9px] font-black text-slate-500 uppercase">Status</p>
												<p className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest">Active</p>
											</div>
										</div>

										{/* Action Footer */}
										<div className="flex gap-4">
											<NavLink
												to={`/admin/manifests/${man.id}`}
												className="flex-[2] text-center bg-white text-[#0f172a] text-[11px] font-black uppercase tracking-tighter py-4 rounded-xl hover:bg-sky-400 transition-all">
												Open Logs
											</NavLink>
											<button
												onClick={() => deleteManifest(man.id)}
												className="flex-1 flex items-center justify-center bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all rounded-xl border border-rose-500/20"
												title="Delete Manifest">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
													/>
												</svg>
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</section>
			</div>
		</div>
	);
}

export default ViewAllManifests;
