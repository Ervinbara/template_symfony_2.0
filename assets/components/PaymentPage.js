// PaymentPage.js
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

// Stripe public key
const stripePromise = loadStripe('your-stripe-public-key');

const PaymentPage = () => {
    return (
        <div>
            <h1>Paiement</h1>
            <Elements stripe={stripePromise}>
                <CheckoutForm />
            </Elements>
        </div>
    );
};

export default PaymentPage;
