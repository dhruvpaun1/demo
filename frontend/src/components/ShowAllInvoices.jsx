import React, {useEffect, useState} from "react";
import {api} from "../axiosSetup";
import {API_ENDPOINT} from "../apiEndpoints";

function ShowAllInvoices() {
	const [invoices, setInvoices] = useState(null);
	const [error, setError] = useState(null);
	const [selectedInvoice, setSelectedInvoice] = useState(null);
	const [isOpen, setIsOpen] = useState(false);

	const markPaid = async (id) => {
		try {
			const res = await api.put(API_ENDPOINT.changeInvoiceStatus, {
				newStatus: "PAID",
				invoiceId: id,
				type: "MANUAL",
				paymentStatus: "SUCCESS",
			});

			if (res.data.success) {
				const updateLogic = (pr) =>
					pr.id === id
						? {
								...pr,
								status: "PAID",
								payment: {
									...pr.payment,
									paymentStatus: "SUCCESS",
									transactionId: "MANUAL-" + id,
									paidAt: new Date(),
									type: "MANUAL",
									amount: Number(pr.packageCost) + Number(pr.deliveryCost),
									createdAt: pr.payment?.createdAt || new Date(),
								},
							}
						: pr;

				setInvoices((prev) => prev.map(updateLogic));
				if (selectedInvoice?.id === id) setSelectedInvoice((pr) => updateLogic(pr));
			}
		} catch (error) {
			setError(error.response?.data?.message || "Operation Failed");
		}
	};

	const markUnPaid = async (id) => {
		try {
			const res = await api.put(API_ENDPOINT.changeInvoiceStatus, {
				newStatus: "UNPAID",
				invoiceId: id,
				type: null,
				paymentStatus: "PENDING",
			});

			if (res.data.success) {
				const updateLogic = (pr) =>
					pr.id === id
						? {
								...pr,
								status: "UNPAID",
								payment: {
									...pr.payment,
									paymentStatus: "PENDING",
									transactionId: null,
									type: null,
									paidAt: null,
									amount: Number(pr.packageCost) + Number(pr.deliveryCost),
									createdAt: pr.payment?.createdAt || new Date(),
								},
							}
						: pr;

				setInvoices((prev) => prev.map(updateLogic));
				if (selectedInvoice?.id === id) setSelectedInvoice((pr) => updateLogic(pr));
			}
		} catch (error) {
			setError(error.response?.data?.message || "Operation Failed");
		}
	};

	useEffect(() => {
		(async () => {
			try {
				const res = await api.get(API_ENDPOINT.viewAllInvoices);
				if (res.data.success) setInvoices(res.data.results);
				else setError(res.data.message);
			} catch (err) {
				setError(err.response?.data?.message || "Server Connection Failed");
			}
		})();
	}, []);

	const getStatusBadge = (status) => {
		const styles = {
			PAID: "bg-emerald-500 text-[#0f172a]",
			UNPAID: "bg-amber-500 text-[#0f172a]",
			OVERDUE: "bg-rose-500 text-white",
		};
		return styles[status] || "bg-slate-700 text-slate-300";
	};

	if (error)
		return (
			<div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
				<div className="bg-rose-500/10 border border-rose-500/30 px-10 py-8 rounded-3xl text-center">
					<p className="text-rose-400 font-bold text-lg">Error</p>
					<p className="text-rose-300 mt-3 text-base">{error}</p>
				</div>
			</div>
		);

	if (!invoices)
		return (
			<div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-6">
				<div className="w-14 h-14 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
				<div className="text-sky-500 text-lg font-semibold">Loading invoices...</div>
			</div>
		);

	return (
		<div className="min-h-screen bg-[#0f172a] text-slate-200 p-10">
			<div className="max-w-7xl mx-auto space-y-12">
				<header className="border-b border-slate-800 pb-8">
					<h1 className="text-5xl font-extrabold text-white">Financial Terminal</h1>
					<p className="text-slate-400 mt-3 text-base">Invoice settlement overview</p>
				</header>

				<div className="hidden lg:grid grid-cols-8 gap-6 px-8 py-5 bg-slate-900/60 rounded-2xl border border-slate-800 text-sm font-semibold text-slate-400 uppercase">
					<div>Invoice</div>
					<div>Tracking</div>
					<div className="text-center">Weight</div>
					<div className="text-center">Package</div>
					<div className="text-center">Delivery</div>
					<div className="text-center text-sky-400">Total</div>
					<div className="text-center">Status</div>
					<div className="text-right">Actions</div>
				</div>

				<div className="space-y-6">
					{invoices.map((inv) => {
						const total = Number(inv.packageCost) + Number(inv.deliveryCost);

						const isPaid = inv.status === "PAID";
						const isUnpaid = inv.status === "UNPAID";
						const isDelivered = inv.deliveryStatus === "DELIVERED";

						const rowStyle = isDelivered
							? "bg-emerald-900/20 border-emerald-600/30"
							: isPaid
								? "bg-sky-900/20 border-sky-600/30"
								: isUnpaid
									? "bg-amber-900/20 border-amber-600/30"
									: "bg-[#1e293b] border-slate-800";

						return (
							<div key={inv.id} className={`grid grid-cols-1 xl:grid-cols-8 gap-6 items-center p-8 rounded-2xl border transition ${rowStyle}`}>
								{/* Invoice */}
								<div className="min-w-0">
									<p className="text-sky-400 font-bold text-lg truncate">#{inv.invoiceNumber}</p>
									<p className="text-slate-400 text-sm">{new Date(inv.created_at).toLocaleDateString()}</p>
								</div>

								{/* Tracking */}
								<div className="min-w-0">
									<p className="text-white font-semibold text-base truncate">{inv.trackingNumber}</p>
									<p className="text-slate-500 text-sm">Global Tracking</p>
								</div>

								{/* Weight */}
								<div className="text-center">{inv.totalWeight} KG</div>

								{/* Package */}
								<div className="text-center">${inv.packageCost}</div>

								{/* Delivery */}
								<div className="text-center">${inv.deliveryCost}</div>

								{/* Total */}
								<div className="text-center">
									<div className="bg-sky-500/10 py-4 rounded-xl border border-sky-500/20">
										<p className="text-xl font-bold text-white">${total}</p>
										<p className="text-sm text-sky-400">Net Payable</p>
									</div>
								</div>

								{/* Status */}
								<div className="flex justify-center">
									<span
										className={`px-4 py-2 rounded-full text-xs font-bold uppercase whitespace-nowrap ${
											isPaid ? "bg-emerald-500 text-[#0f172a]" : isUnpaid ? "bg-amber-500 text-[#0f172a]" : "bg-slate-700 text-slate-300"
										}`}>
										{inv.status}
									</span>
								</div>

								{/* Actions */}
								<div className="flex justify-end items-center gap-3 flex-wrap">
									<button
										onClick={() => (!isPaid ? markPaid(inv.id) : markUnPaid(inv.id))}
										className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
											!isPaid ? "border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-black" : "border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white"
										}`}>
										{!isPaid ? "Mark Paid" : "Mark Unpaid"}
									</button>

									<button
										onClick={() => {
											setSelectedInvoice(inv);
											setIsOpen(true);
										}}
										disabled={!isPaid}
										className="px-4 py-2 bg-[#0f172a] border border-slate-700 text-slate-400 rounded-lg hover:enabled:border-sky-500 hover:enabled:text-sky-500 disabled:opacity-40 transition">
										View
									</button>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<PaymentDetailsModal invoice={selectedInvoice} isOpen={isOpen} onClose={() => setIsOpen(false)} />
		</div>
	);
}

/* ---------------- Modal ---------------- */

function PaymentDetailsModal({isOpen, invoice, onClose}) {
	if (!isOpen || !invoice) return null;
	const payment = invoice?.payment || {};
	const total = Number(invoice.packageCost) + Number(invoice.deliveryCost);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
			<div className="max-w-2xl w-full bg-[#111827] border border-slate-800 rounded-3xl shadow-2xl">
				<div className="p-8 border-b border-slate-800 flex justify-between items-center">
					<h2 className="text-2xl font-bold text-white">Payment Details</h2>
					<button onClick={onClose} className="text-slate-400 hover:text-white text-xl">
						✕
					</button>
				</div>

				<div className="p-10 space-y-6 text-base">
					<DetailBox label="Status" value={payment.paymentStatus || "N/A"} />
					<DetailBox label="Method" value={payment.type || "SYSTEM"} />
					<DetailBox label="Transaction ID" value={payment.transactionId || "N/A"} mono />
					<DetailBox label="Package Cost" value={`$${invoice.packageCost}`} />
					<DetailBox label="Delivery Cost" value={`$${invoice.deliveryCost}`} />
					<DetailBox label="Total Amount" value={`$${total}`} />
					<DetailBox label="Processed At" value={payment.paidAt ? new Date(payment.paidAt).toLocaleString() : "N/A"} />
				</div>

				<div className="p-8 border-t border-slate-800 text-right">
					<button onClick={onClose} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold">
						Close
					</button>
				</div>
			</div>
		</div>
	);
}

function DetailBox({label, value, mono}) {
	return (
		<div>
			<p className="text-slate-400 text-sm mb-1">{label}</p>
			<p className={`text-white text-base ${mono ? "font-mono break-all" : "font-semibold"}`}>{value}</p>
		</div>
	);
}

export default ShowAllInvoices;
