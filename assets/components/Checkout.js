// assets/components/Checkout.js
import React, { useState } from 'react';
import axios from 'axios';

const Checkout = () => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/checkout', {
            payment_method: paymentMethod,
        }).then(response => {
            setStatus('Order placed successfully!');
        }).catch(error => {
            setStatus('Error placing order.');
        });
    };

    return (
        <div>
            <h2>Checkout</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Payment Method:</label>
                    <input 
                        type="text" 
                        value={paymentMethod} 
                        onChange={(e) => setPaymentMethod(e.target.value)} 
                    />
                </div>
                <button type="submit">Place Order</button>
            </form>
            {status && <p>{status}</p>}
        </div>
    );
};

export default Checkout;
