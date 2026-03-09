import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

function Sidebar() {
	const { isAuthenticated, role } = useSelector((state) => state.auth);

	if (!isAuthenticated) return null;

	const baseClasses =
		"block px-4 py-3 rounded-lg text-sm font-medium transition-all";

	const activeClasses =
		"bg-sky-500/10 text-sky-400 border border-sky-500/30";

	const inactiveClasses =
		"text-slate-300 hover:bg-slate-800 hover:text-sky-400";

	return (
		<aside className="w-64 bg-[#0f172a] border-r border-slate-800 min-h-screen p-6">
			<h2 className="text-slate-400 text-xs uppercase tracking-widest mb-6">
				Navigation
			</h2>

			<div className="space-y-2">

				{/* USER NAV */}
				{role === "user" && (
					<>
						<NavLink
							to="/profile"
							className={({ isActive }) =>
								`${baseClasses} ${
									isActive ? activeClasses : inactiveClasses
								}`
							}
						>
							Profile
						</NavLink>

						<NavLink
							to="/my-packages"
							className={({ isActive }) =>
								`${baseClasses} ${
									isActive ? activeClasses : inactiveClasses
								}`
							}
						>
							Packages
						</NavLink>

						<NavLink
							to="/user/view-history"
							className={({ isActive }) =>
								`${baseClasses} ${
									isActive ? activeClasses : inactiveClasses
								}`
							}
						>
							Tracking History
						</NavLink>
						<NavLink
							to="/user/view-invoice"
							className={({ isActive }) =>
								`${baseClasses} ${
									isActive ? activeClasses : inactiveClasses
								}`
							}
						>
							Invoices
						</NavLink>
						<NavLink
							to="/user/report-query"
							className={({ isActive }) =>
								`${baseClasses} ${
									isActive ? activeClasses : inactiveClasses
								}`
							}
						>
							Report Query
						</NavLink>
					</>
				)}

				{/* ADMIN NAV */}
				{role === "admin" && (
					<>
						<NavLink to="/admin/dashboard" className={({ isActive }) =>
							`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
						}>
							Dashboard
						</NavLink>

						<NavLink to="/admin/manage-user" className={({ isActive }) =>
							`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
						}>
							Users
						</NavLink>

						<NavLink to="/add-package" className={({ isActive }) =>
							`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
						}>
							Inventory
						</NavLink>

						<NavLink to="/admin/view-history" className={({ isActive }) =>
							`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
						}>
							Global History
						</NavLink>

						<NavLink to="/admin/create-invoice" className={({ isActive }) =>
							`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
						}>
							Payments
						</NavLink>

						<NavLink to="/admin/manifests" className={({ isActive }) =>
							`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
						}>
							Manifest
						</NavLink>
						<NavLink to="/admin/view-queries" className={({ isActive }) =>
							`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
						}>
							View Queries
						</NavLink>
						<NavLink to="/admin/scheduled-deliveries" className={({ isActive }) =>
							`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
						}>
							Deliveries
						</NavLink>
					</>
				)}
			</div>
		</aside>
	);
}

export default Sidebar;
