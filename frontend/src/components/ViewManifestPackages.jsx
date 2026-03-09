import React from "react";
import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {api} from "../axiosSetup";
import {API_ENDPOINT} from "../apiEndpoints";
import {Controller, useForm} from "react-hook-form";
import Select from "react-select";
function ViewManifestPackages() {
	const {manifestId} = useParams();
	const [error, setError] = useState(null);
	const [packages, setPackages] = useState([]);
	const [manifestName,setManifestName]=useState(null)
	const [packagesOption, setPackagesOption] = useState([]);
	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: {errors, isSubmitting},
	} = useForm();
	const getManifestName=async (id)=>{
		const res=await api.post(API_ENDPOINT.getManifestById,{
			id
		})
		if(res.data.success)
		{
			setManifestName(res.data.results.manifestName)
		}else{
			setError("Could not find manifest packages")
		}
	}
	const viewAllPackages = async () => {
		const res = await api.get(API_ENDPOINT.viewManifestPackages(manifestId));
		if (res.data.success) {
			setPackages(res.data.results);
		} else {
			setError(res.data.message);
		}
	};

	useEffect(() => {
		viewAllPackages();
		getManifestName(manifestId)
	}, [manifestId]);

	return (
		<div className="min-h-screen bg-[#0f172a] text-slate-200 px-4 py-8 lg:px-10 lg:py-12">
			<div className="max-w-350 mx-auto space-y-10">
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl font-black tracking-tight text-white">Manifest Packages</h1>
					<p className="text-[11px] text-slate-400 uppercase font-bold tracking-widest">
						Manifest Name: <span className="text-sky-400">{manifestName}</span>
					</p>
				</div>

				{error && <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl font-bold border-l-4 border-l-rose-500">{error}</div>}

				{/* <div className="bg-[#020617] border border-slate-800 rounded-2xl p-6 shadow-xl">
					<h2 className="text-lg font-black text-white mb-4">Assign Packages to Manifest</h2>

					<form onSubmit={handleSubmit(addNewPackages)} className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-end">
						<div>
							<label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Available Packages</label>

							<Controller
								name="packages"
								control={control}
								rules={{required: true}}
								render={({field}) => (
									<Select
										{...field}
										isMulti
										options={packagesOption}
										placeholder="Select packages to assign"
										styles={{
											control: (base) => ({
												...base,
												backgroundColor: "#020617",
												borderColor: "#334155",
												color: "#e2e8f0",
												minHeight: "48px",
											}),
											menu: (base) => ({
												...base,
												backgroundColor: "#020617",
											}),
											option: (base, state) => ({
												...base,
												backgroundColor: state.isFocused ? "#0ea5e9" : "#020617",
												color: state.isFocused ? "#020617" : "#e2e8f0",
											}),
											multiValue: (base) => ({
												...base,
												backgroundColor: "#0ea5e9",
											}),
											multiValueLabel: (base) => ({
												...base,
												color: "#020617",
												fontWeight: "700",
											}),
										}}
									/>
								)}
							/>
						</div>

						<button
							type="submit"
							disabled={isSubmitting}
							className="h-12 px-8 bg-sky-500 hover:bg-sky-400 text-[#0f172a] font-black rounded-xl transition-all uppercase text-xs tracking-widest disabled:opacity-50">
							Add Packages
						</button>
					</form>
				</div> */}

				<div className="bg-[#1e293b] rounded-2xl border border-slate-800 shadow-2xl">
					<div className="p-6 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
						<h2 className="text-lg font-black tracking-tight text-white">Linked Packages</h2>
						<span className="text-[10px] bg-sky-500/10 text-sky-500 px-4 py-2 rounded-full border border-sky-500/20 font-bold uppercase tracking-widest">Total: {packages.length}</span>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full text-left">
							<thead className="bg-slate-900/60 text-[10px] uppercase font-black text-slate-500 tracking-widest">
								<tr>
									<th className="px-6 py-4">Tracking</th>
									<th className="px-6 py-4">Weight</th>
									<th className="px-6 py-4">Cost</th>
									<th className="px-6 py-4">Status</th>
									<th className="px-6 py-4 text-right">Action</th>
								</tr>
							</thead>

							<tbody className="divide-y divide-slate-800">
								{packages.length === 0 && (
									<tr>
										<td colSpan="5" className="px-6 py-16 text-center text-slate-400 italic text-sm bg-slate-900/40">
											No packages linked to this manifest.
										</td>
									</tr>
								)}

								{packages.map((pk) => (
									<tr key={pk.id} className="bg-slate-900/30 hover:bg-slate-800 transition-colors">
										<td className="px-6 py-4">
											<div className="text-sky-400 font-mono font-black text-sm">{pk.trackingNumber}</div>
											
										</td>

										<td className="px-6 py-4 text-xs font-bold">{pk.weight} KG</td>

										<td className="px-6 py-4 text-xs font-bold">${pk.itemCost}</td>

										<td className="px-6 py-4">
											<span className="px-3 py-1 rounded-full text-[9px] font-black uppercase bg-slate-900 border border-slate-700 text-slate-300">{pk.status}</span>
										</td>

										<td className="px-6 py-4 text-right">
											<button
												onClick={(e) => deletePackage(e.target.value)}
												value={pk.id}
												className="px-4 py-2 rounded-lg text-[10px] font-black uppercase bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition">
												Delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ViewManifestPackages;
