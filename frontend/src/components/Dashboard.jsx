import React, {useEffect, useState} from "react";
import {api} from "../axiosSetup";
import {API_ENDPOINT} from "../apiEndpoints";
import ReactChart from "./ReactChart";
import CustomerDataChart from "./CustomerDataChart";

function Dashboard() {
	const [result, setResult] = useState(null);
	const [status, setStatus] = useState(null);
	const [data, setData] = useState([]);
	const [queryData, setQueryData] = useState([]);
	const [fromDate, setFromDate] = useState(null);
	const [toDate, setToDate] = useState(null);
	const [resApi, setResApi] = useState(null);
	useEffect(() => {
		const today = new Date();
		const sixMonthsAgo = new Date();

		sixMonthsAgo.setMonth(today.getMonth() - 6);

		const formatDate = (date) => {
			return date.toISOString().split("T")[0];
		};

		const formattedToday = formatDate(today);
		const formattedSixMonthsAgo = formatDate(sixMonthsAgo);

		setFromDate(formattedSixMonthsAgo);
		setToDate(formattedToday);

		getChartData(formattedSixMonthsAgo, formattedToday);
	}, []);
	useEffect(() => {
		(async () => {
			const res = await api.get(API_ENDPOINT.adminDashboard);
			if (res.data.success) {
				setResult(res.data.results);
				const dataOfApi = res.data.results;
				const formattedChartData = dataOfApi.statusCounts.map((item) => ({
					x: item.status,
					y: item.count,
				}));
				setData(formattedChartData);
				const queryFormatted = dataOfApi.queryStatusCounts.map((item) => ({
					x: item.status,
					y: item.count,
				}));
				setQueryData(queryFormatted);
			} else {
				setStatus(res.data.message);
			}
		})();
	}, []);
	const getChartData = async (start, end) => {
		try {
			const res = await api.get(API_ENDPOINT.getCustomDateData, {
				params: {
					startDate: start,
					endDate: end,
				},
			});

			if (res.data.success) {
				setResApi(res);
			}
		} catch (error) {
			console.log(error);
		}
	};
	const StatCard = ({title, value, colorClass}) => (
		<div className="bg-[#1e293b] p-6 rounded-xl border border-slate-800 shadow-lg">
			<p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-1">{title}</p>
			<h3 className={`text-3xl font-bold ${colorClass || "text-white"}`}>{value}</h3>
		</div>
	);

	return (
		<div className="min-h-screen bg-[#0f172a] text-slate-200 p-8">
			<div className="space-y-8">
				{/* Header */}
				<header className="mb-6">
					<h1 className="text-4xl font-extrabold text-white tracking-tight">Admin Overview</h1>
					<p className="text-slate-400 mt-2">Real-time logistics and user metrics.</p>
				</header>

				{/* Status / Error */}
				{status && <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg">{status}</div>}

				{/* Loading */}
				{!result ? (
					<div className="flex flex-col items-center justify-center py-20">
						<div className="animate-spin rounded-full h-10 w-10 border-t-2 border-sky-500 mb-4"></div>
						<h2 className="text-slate-400 animate-pulse uppercase tracking-widest text-sm font-bold">Initialising Dashboard...</h2>
					</div>
				) : (
					<>
						{/* Stat Cards */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
							<StatCard title="Total Users" value={result.users} colorClass="text-sky-400" />
							<StatCard title="Total Packages" value={result.packages} colorClass="text-indigo-400" />
							<StatCard title="Pending" value={result.Pending || 0} colorClass="text-amber-500" />
							<StatCard title="Packed" value={result.Packed || 0} colorClass="text-blue-400" />
							<StatCard title="Ready for Shipment" value={result["Ready for Shipment"] || 0} colorClass="text-purple-400" />
							<StatCard title="In Transit" value={result.Shipped || 0} colorClass="text-cyan-400" />
							<StatCard title="Received" value={result.Received || 0} colorClass="text-teal-400" />
							<StatCard title="Ready to Deliver" value={result["Ready to Deliver"] || 0} colorClass="text-emerald-400" />
							<StatCard title="Completed" value={result.Delivered || 0} colorClass="text-emerald-500" />
							<StatCard title="Package Queries" value={result.packageQueriesCounts || 0} colorClass="text-emerald-500" />
						</div>

						{/* Charts Section */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
							<div className="bg-[#1e293b] p-6 rounded-xl border border-slate-800 shadow-lg flex flex-col items-center">
								<h2 className="text-xl font-bold mb-4 text-white text-center">Package Status Distribution</h2>
								<ReactChart data={data.map((item) => ({name: item.x, y: item.y}))} />
							</div>
							<div className="bg-[#1e293b] p-6 rounded-xl border border-slate-800 shadow-lg flex flex-col items-center">
								<h2 className="text-xl font-bold mb-4 text-white text-center">Query Status Distribution</h2>
								<ReactChart data={queryData.map((item) => ({name: item.x, y: item.y}))} />
							</div>
						</div>

						{/* Customer Growth Chart */}
						<div className="bg-[#1e293b] p-6 rounded-xl border border-slate-800 shadow-lg space-y-6 mt-8">
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
								{/* Date Filters */}
								<div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
									<div className="flex flex-col">
										<label className="text-xs uppercase tracking-widest text-slate-400 mb-2">From Date</label>
										<input
											type="date"
											value={fromDate || ""}
											onChange={(e) => {
												setFromDate(e.target.value);
												getChartData(e.target.value, toDate);
											}}
											className="bg-[#0f172a] border border-slate-700 text-slate-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
										/>
									</div>
									<div className="flex flex-col">
										<label className="text-xs uppercase tracking-widest text-slate-400 mb-2">To Date</label>
										<input
											type="date"
											value={toDate || ""}
											onChange={(e) => {
												const selectedToDate = e.target.value;
												setToDate(selectedToDate);
												getChartData(fromDate, selectedToDate);
											}}
											className="bg-[#0f172a] border border-slate-700 text-slate-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
										/>
									</div>
									<div className="flex flex-col">
										<label className="text-xs uppercase tracking-widest text-slate-400 mb-2">Quick Select</label>
										<select
											className="bg-[#0f172a] border border-slate-700 text-slate-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
											onChange={(e) => getChartData(e.target.value.split("T")[0], new Date().toISOString().split("T")[0])}>
											<option value={new Date().toISOString()}>Today</option>
											<option value={new Date(new Date().setDate(new Date().getDate() - 7)).toISOString()}>Last Week</option>
											<option value={new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString()}>Last Month</option>
											<option value={new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString()}>Last 3 Months</option>
											<option value={new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString()}>Last 6 Months</option>
											<option value={new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString()}>Last 1 Year</option>
										</select>
									</div>
								</div>

								{/* Title */}
								<h2 className="text-xl font-bold text-white text-center md:text-right">User Growth</h2>
							</div>

							{/* Chart */}
							{resApi && <CustomerDataChart res={resApi} />}
						</div>
					</>
				)}
			</div>
		</div>
	);
}

export default Dashboard;
