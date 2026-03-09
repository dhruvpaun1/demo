import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../axiosSetup";
import { API_ENDPOINT } from "../apiEndpoints";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

// Move outside to avoid re-initialization
const stripePromise = loadStripe(import.meta.env.VITE_PUBLISHABLE_KEY);

function CheckoutPage() {
    const { invoiceId } = useParams();
    const [loading, setLoading] = useState(true);
    const [clientSecret, setClientSecret] = useState(null);
    const [invoiceData, setInvoiceData] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.post(API_ENDPOINT.createCheckoutSession, { invoiceId });
                if (res.data.success) {
                    setClientSecret(res.data.results.clientSecret);
                    setInvoiceData(res.data.results.invoice);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        })();
    }, [invoiceId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 antialiased">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-[#1e293b] rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
                
                {/* Left Side: Order Summary */}
                <div className="p-8 md:p-12 bg-[#1e293b] flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
                    <div>
                        <div className="flex items-center gap-2 mb-8">
                            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">S</div>
                            <span className="text-slate-200 font-semibold tracking-tight">STRIPE DEMO</span>
                        </div>
                        
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Pay Invoice #{invoiceData?.number}</p>
                        <h1 className="text-4xl font-bold text-white mb-6">${invoiceData?.amount}</h1>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Standard Plan</span>
                                <span className="text-white">${invoiceData?.amount}</span>
                            </div>
                            <div className="flex justify-between text-sm border-t border-slate-800 pt-4">
                                <span className="text-slate-400">Subtotal</span>
                                <span className="text-white">${invoiceData?.amount}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-2">
                                <span className="text-white">Total due</span>
                                <span className="text-white">${invoiceData?.amount}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 text-xs text-slate-500 italic">
                        Powered by Stripe | Secure Payment Encryption
                    </div>
                </div>

                {/* Right Side: Payment Form */}
                <div className="p-8 md:p-12 bg-white">
                    <h2 className="text-slate-900 font-bold text-xl mb-6">Payment Details</h2>
                    {clientSecret && (
                        <Elements 
                            stripe={stripePromise} 
                            options={{
                                clientSecret, 
                                appearance: {
                                    theme: 'stripe', // Use the official 'stripe' theme
                                    variables: {
                                        colorPrimary: '#2563eb', // Blue-600
                                    }
                                }
                            }}
                        >
                            <CheckoutForm invoiceId={invoiceId} />
                        </Elements>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;