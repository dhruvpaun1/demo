import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useState } from 'react'

function CheckoutForm({ invoiceId }) {
    const stripe = useStripe()
    const elements = useElements()
    const [error, setError] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!stripe || !elements) return;

        setIsProcessing(true)
        setError(null)

        try {
            const res = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    // Note: ensure this matches the 'invoiceId' key in your StatusPage!
                    return_url: `${window.location.origin}/payment-status?invoiceId=${invoiceId}`
                }
            })

            if (res.error) {
                setError(res.error.message)
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.")
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="animate-in fade-in duration-500">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Wrap PaymentElement in a styled container if needed, 
                    but Stripe's 'appearance' prop usually handles this */}
                <div className="min-h-[250px]">
                    <PaymentElement options={{ layout: "tabs" }} />
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                )}

                <button
                    disabled={isProcessing || !stripe || !elements}
                    type="submit"
                    className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
                >
                    {isProcessing ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        "Complete Payment"
                    )}
                </button>

                <p className="text-center text-xs text-slate-400 mt-4">
                    Your payment details are encrypted and secure.
                </p>
            </form>
        </div>
    )
}

export default CheckoutForm