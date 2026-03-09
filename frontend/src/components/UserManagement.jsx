import React, {useState, useEffect} from "react";
import {api} from "../axiosSetup";
import {API_ENDPOINT} from "../apiEndpoints";

function UserManagement() {
	const [users, setUsers] = useState(null);
	const [error, setError] = useState(null);
	const [isAddingUser, setIsAddingUser] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [editFormData, setEditFormData] = useState({name: "", email: "", status: "", dob: new Date()});
	const [newUser, setNewUser] = useState({name: "", email: "", password: "", status: "active", dob: new Date()});

	const fetchUser = async () => {
		try {
			const res = await api.get(API_ENDPOINT.getAllUsers);
			if (res.data.success) setUsers(res.data.results);
			else setError(res.data.message);
		} catch (err) {
			setError("Failed to synchronize user database.");
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	const addUser = async () => {
		if (!newUser.email || !newUser.name || !newUser.password || !newUser.dob) {
			setError("Security validation failed: All fields are required.");
			return;
		}
		try {
			const res = await api.post(API_ENDPOINT.addUser, newUser);
			if (res.data.success) {
				fetchUser();
				setIsAddingUser(false);
				setNewUser({name: "", email: "", password: "", status: "active"});
				setError(null);
			}
		} catch (err) {
			setError(err.response?.data?.message || "Error creating user");
		}
	};

	const saveEdit = async (id) => {
		try {
			const res = await api.put(API_ENDPOINT.updateUser(id), editFormData);
			if (res.data.success) {
				setEditingId(null);
				fetchUser();
			}
		} catch (err) {
			setError("Failed to update user records.");
		}
	};

	const deleteUser = async (id) => {
		if (window.confirm("CONFIRM DELETION: This action will revoke all access for this user.")) {
			try {
				const res = await api.delete(API_ENDPOINT.deleteUser(id));
				if (res.data.success) fetchUser();
			} catch (err) {
				setError("Deletion blocked: User may have active packages.");
			}
		}
	};

	const startEdit = (user) => {
		setEditingId(user.id);
		const formattedDob = user.dateOfBirth 
        ? new Date(user.dateOfBirth).toISOString().split('T')[0] 
        : "";
		setEditFormData({name: user.name, email: user.email, status: user.status, dob: formattedDob});
	};

	return (
		<div className="min-h-screen bg-[#0f172a] text-slate-200 p-8">
			<div className="max-w-7xl mx-auto space-y-8">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold text-white tracking-tight">Personnel Management</h1>
						<p className="text-slate-400 text-sm mt-1">Control access levels and manage active accounts.</p>
					</div>
					{!isAddingUser && (
						<button onClick={() => setIsAddingUser(true)} className="bg-sky-500 hover:bg-sky-400 text-[#0f172a] font-bold px-6 py-2 rounded-lg transition-all shadow-lg shadow-sky-500/20">
							+ Register New User
						</button>
					)}
				</div>

				{error && (
					<div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-lg text-sm flex justify-between items-center">
						<span>{error}</span>
						<button onClick={() => setError(null)} className="text-lg">
							&times;
						</button>
					</div>
				)}

				{isAddingUser && (
					<div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 shadow-xl animate-in slide-in-from-top duration-300">
						<h2 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">User Registration Manifest</h2>
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							<input
								className="bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
								placeholder="Username"
								value={newUser.name}
								onChange={(e) => setNewUser({...newUser, name: e.target.value})}
							/>
							<input
								className="bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
								placeholder="Email"
								value={newUser.email}
								onChange={(e) => setNewUser({...newUser, email: e.target.value})}
							/>
							<input
								className="bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
								type="password"
								placeholder="Password"
								value={newUser.password}
								onChange={(e) => setNewUser({...newUser, password: e.target.value})}
							/>
							<select
								className="bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
								value={newUser.status}
								onChange={(e) => setNewUser({...newUser, status: e.target.value})}>
								<option value="active">Active</option>
								<option value="inactive">Inactive</option>
							</select>
							<input
								className="bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
								type="date"
								placeholder="DOB"
								value={newUser.dob}
								onChange={(e) => setNewUser({...newUser, dob: e.target.value})}
							/>
						</div>
						<div className="flex gap-3 mt-4">
							<button onClick={addUser} className="bg-emerald-500 hover:bg-emerald-400 text-[#0f172a] font-bold px-6 py-2 rounded-lg text-sm">
								Save Record
							</button>
							<button onClick={() => setIsAddingUser(false)} className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-6 py-2 rounded-lg text-sm">
								Cancel
							</button>
						</div>
					</div>
				)}

				<div className="bg-[#1e293b] rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
					<table className="w-full text-left">
						<thead className="bg-slate-800/50 text-[10px] uppercase font-bold text-slate-500 tracking-widest">
							<tr>
								<th className="px-6 py-4">Username</th>
								<th className="px-6 py-4">Email Address</th>
								<th className="px-6 py-4">Status</th>
								<th className="px-6 py-4">DOB</th>
								<th className="px-6 py-4 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-800">
							{users && users.length > 0 ? (
								users.map((user) => (
									<tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
										{editingId === user.id ? (
											<>
												<td className="px-6 py-3">
													<input
														className="bg-[#0f172a] border border-slate-700 rounded px-2 py-1 text-sm w-full"
														value={editFormData.name}
														onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
													/>
												</td>
												<td className="px-6 py-3">
													<input
														className="bg-[#0f172a] border border-slate-700 rounded px-2 py-1 text-sm w-full"
														value={editFormData.email}
														onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
													/>
												</td>
												<td className="px-6 py-3">
													<select
														className="bg-[#0f172a] border border-slate-700 rounded px-2 py-1 text-sm"
														value={editFormData.status}
														onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}>
														<option value="active">Active</option>
														<option value="inactive">Inactive</option>
													</select>
												</td>
												<td className="px-6 py-3">
													<input
														type="date"
														className="bg-[#0f172a] border border-slate-700 rounded px-2 py-1 text-sm w-full"
														value={editFormData.dob}
														onChange={(e) => setEditFormData({...editFormData, dob: e.target.value})}
													/>
												</td>
												<td className="px-6 py-3 text-right space-x-2">
													<button onClick={() => saveEdit(user.id)} className="text-emerald-500 font-bold text-xs uppercase hover:underline">
														Commit
													</button>
													<button onClick={() => setEditingId(null)} className="text-slate-500 font-bold text-xs uppercase hover:underline">
														Abort
													</button>
												</td>
											</>
										) : (
											<>
												<td className="px-6 py-4 text-sm font-semibold text-white">{user.name}</td>
												<td className="px-6 py-4 text-sm text-slate-400">{user.email}</td>
												<td className="px-6 py-4">
													<span
														className={`px-2 py-1 rounded text-[10px] font-black uppercase border ${user.status === "active" ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : "text-slate-500 bg-slate-500/10 border-slate-500/20"}`}>
														{user.status}
													</span>
												</td>
												<td className="px-6 py-4 text-sm text-slate-400">
													{user.dateOfBirth && user.dateOfBirth !== "0000-00-00" ? (
														new Date(user.dateOfBirth).toLocaleDateString("en-IN", {
															day: "2-digit",
															month: "short",
															year: "numeric",
														})
													) : (
														<span className="text-slate-600 italic">Not Provided</span>
													)}
												</td>
												<td className="px-6 py-4 text-right space-x-4">
													<button onClick={() => startEdit(user)} className="text-sky-500 hover:text-sky-400 text-xs font-bold uppercase tracking-tighter">
														Modify
													</button>
													<button onClick={() => deleteUser(user.id)} className="text-rose-500 hover:text-rose-400 text-xs font-bold uppercase tracking-tighter">
														Terminate
													</button>
												</td>
											</>
										)}
									</tr>
								))
							) : (
								<tr>
									<td colSpan="4" className="px-6 py-20 text-center text-slate-500 italic">
										{users === null ? "Establishing connection to personnel database..." : "No active users found."}
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default UserManagement;
