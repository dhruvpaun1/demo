import React, {useEffect, useState} from "react";
import {api} from "../axiosSetup";
import {API_ENDPOINT} from "../apiEndpoints";
import InvoicePDF from "./PdfGenerator";
import {PDFDownloadLink} from "@react-pdf/renderer";
import {statusOptions} from "../constants/statuses";

function Deliveries() {
	const [delieveryData, setDeliveryData] = useState([]);
	const [error, setError] = useState(null);
	const [invoice, setInvoice] = useState({});
	const [editStatus, setEditStatus] = useState(null);
	const [editingId, setEditingId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [packages, setPackages] = useState(null);
	const generateInvoice = async (packageId) => {
		try {
			const res = await api.post(API_ENDPOINT.invoiceGenerator, {packageId});
			if (res.data.success) {
				const newInvoiceData = res.data.results;
				setInvoice((prev) => ({...prev, [packageId]: newInvoiceData}));
				setDeliveryData((prevData) => prevData.map((item) => (item.id === packageId ? {...item, invoice: newInvoiceData} : item)));
			} else {
				setError("Could not create invoice");
			}
		} catch {
			setError("Error in creating Invoice");
		}
	};
	const fetchData = async () => {
		try {
			const [pkgRes] = await Promise.all([api.get(API_ENDPOINT.viewAdminPackages)]);
			if (pkgRes.data.success) setPackages(pkgRes.data.results);
		} catch (err) {
			setError("Package ync Failed");
		}
	};
	const handleUpdateStatus = async (id) => {
		try {
			const res = await api.put(API_ENDPOINT.editStatusForPackage(id), {newStatus: editStatus});

			if (res.data.success) {
				// 1. Update the table data state directly
				setDeliveryData((prevData) =>
					prevData.map((item) =>
						item.id === id
							? {...item, status: editStatus} // Update the status of the matching ID
							: item,
					),
				);

				// 2. Close the editing mode
				setEditingId(null);
			}
		} catch (error) {
			console.error(error);
			alert("Update Failed");
		}
	};

	useEffect(() => {
		(async () => {
			try {
				const res = await api.get(API_ENDPOINT.getDeliveryData);
				if (res.data.success) {
					setDeliveryData(res.data.results);
					const existingInvoices = {};
					res.data.results.forEach((item) => {
						if (item.Invoice) existingInvoices[item.id] = item.Invoice;
					});
					setInvoice(existingInvoices);
				} else {
					setError(res.data.message);
				}
			} catch {
				setError("Server Error Connection");
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	if (loading)
		return (
			<div className="min-h-screen bg-slate-950 flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<div className="w-10 h-10 border-4 border-slate-700 border-t-sky-500 rounded-full animate-spin" />
					<p className="text-slate-400 text-sm tracking-wide">Loading deliveries...</p>
				</div>
			</div>
		);

	return (
		<div className="min-h-screen bg-slate-950 text-slate-200 p-6 lg:p-10">
			<div className="max-w-7xl mx-auto space-y-8">
				{/* Header */}
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<div>
						<h1 className="text-3xl lg:text-4xl font-bold text-white">Delivery Dashboard</h1>
						<p className="text-slate-400 text-sm mt-1">Manage shipments, invoices, and status updates</p>
					</div>
					{error && <div className="px-4 py-2 bg-rose-500/10 border border-rose-500/40 rounded-lg text-rose-400 text-sm">{error}</div>}
				</div>

				{/* Table Card */}
				<div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead className="bg-slate-800 text-slate-400 uppercase text-xs tracking-wide">
								<tr>
									<th className="px-6 py-4 text-left">Tracking</th>
									<th className="px-6 py-4 text-left">Receiver</th>
									<th className="px-6 py-4 text-center">Weight</th>
									<th className="px-6 py-4 text-center">Total</th>
									<th className="px-6 py-4 text-center">Status</th>
									<th className="px-6 py-4 text-center">Update</th>
									<th className="px-6 py-4 text-center">Invoice</th>
									<th className="px-6 py-4 text-right">Action</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-800">
								{delieveryData.length > 0 ? (
									delieveryData.map((dt) => {
										const isDelivered = dt.status === "Delivered to Customer";
										return (
											<tr key={dt.id} className="hover:bg-slate-800/50 transition">
												<td className="px-6 py-5">
													<div className="flex flex-col">
														<span className="font-semibold text-sky-400">{dt.trackingNumber}</span>
													</div>
												</td>

												<td className="px-6 py-5">
													<div>
														<p className="font-medium text-white">{dt.deliveryDetails?.receiverName || "Unknown"}</p>
														<p className="text-xs text-slate-400 truncate max-w-[220px]">{dt.deliveryDetails?.address}</p>
													</div>
												</td>

												<td className="px-6 py-5 text-center">
													<span className="px-3 py-1 bg-slate-800 rounded-lg">{dt.weight} KG</span>
												</td>

												<td className="px-6 py-5 text-center font-semibold text-white">${Number(dt.itemCost) + 1}</td>

												<td className="px-6 py-5 text-center">
													{editingId === dt.id ? (
														<select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs">
															{statusOptions.map((opt) => (
																<option key={opt} value={opt}>
																	{opt}
																</option>
															))}
														</select>
													) : (
														<span className={`px-3 py-1 rounded-full text-xs font-medium ${isDelivered ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-300"}`}>{dt.status}</span>
													)}
												</td>

												<td className="px-6 py-5 text-center">
													{editingId === dt.id ? (
														<div className="flex justify-center gap-3 text-xs">
															<button onClick={() => handleUpdateStatus(dt.id)} className="text-emerald-400 hover:underline">
																Save
															</button>
															<button onClick={() => setEditingId(null)} className="text-rose-400 hover:underline">
																Cancel
															</button>
														</div>
													) : (
														<button
															onClick={() => {
																setEditStatus(dt.status);
																setEditingId(dt.id);
															}}
															className="text-sky-400 text-xs hover:underline">
															Edit
														</button>
													)}
												</td>

												<td className="px-6 py-5 text-center">
													<span className={`px-3 py-1 rounded-full text-xs ${dt?.invoice?.status ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"}`}>
														{dt?.invoice?.status || "Not Generated"}
													</span>
												</td>

												<td className="px-6 py-5 text-right">
													{!dt.invoice ? (
														<button onClick={() => generateInvoice(dt.id)} className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-900 rounded-lg text-xs font-semibold transition">
															Generate
														</button>
													) : (
														<PDFDownloadLink
															document={<InvoicePDF invoice={dt.invoice} />}
															fileName={`INV-${dt.invoice.invoiceNumber}.pdf`}
															className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-lg text-xs font-semibold transition">
															{({loading}) => (loading ? "Preparing..." : "Download")}
														</PDFDownloadLink>
													)}
												</td>
											</tr>
										);
									})
								) : (
									<tr>
										<td colSpan="8" className="text-center py-16 text-slate-500">
											No deliveries available
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					<div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
						<p className="text-slate-400 text-xs uppercase tracking-wide">Total Packages</p>
						<p className="text-3xl font-bold text-white mt-2">{delieveryData.length}</p>
					</div>

					<div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
						<p className="text-slate-400 text-xs uppercase tracking-wide">Delivered</p>
						<p className="text-3xl font-bold text-emerald-400 mt-2">{delieveryData.filter((d) => d.status === "Delivered to Customer").length}</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Deliveries;
