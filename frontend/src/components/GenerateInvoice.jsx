import React, {useEffect, useState} from "react";
import {API_ENDPOINT} from "../apiEndpoints";
import {api} from "../axiosSetup";
import {PDFDownloadLink} from "@react-pdf/renderer";
import InvoicePDF from "./PdfGenerator";
import ShowAllInvoices from "./ShowAllInvoices";

export default function GenerateInvoice() {
	const [packages, setPackages] = useState([]);
	const [error, setError] = useState(null);
	const [selected, setSelected] = useState(null);
	const [invoiceData, setInvoiceData] = useState(null);

	const getAllPackages = async () => {
		const res = await api.get(API_ENDPOINT.viewAdminPackages);
		if (res.data.success) setPackages(res.data.results);
		else setError(res.data.message);
	};

	const createInvoice = async () => {
		try {
			const res = await api.post(API_ENDPOINT.invoiceGenerator, {
				packageId: selected,
			});
			if (res.data.success) setInvoiceData(res.data.results);
			else setError(res.data.message);
		} catch (error) {
			if(error.response)
			{
				setError(error.response.data.message)
			}else{
				setError("Server Error")
			}
		}
	};

	useEffect(() => {
		getAllPackages();
	}, []);

	return (

					<div className="p-2 sm:p-6">
						<ShowAllInvoices />
					</div>
		
	);
}
