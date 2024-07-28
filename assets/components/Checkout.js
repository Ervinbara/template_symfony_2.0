import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Checkout = () => {
    const stripe = useStripe();
    const elements = useElements();
    const history = useHistory();
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [newAddress, setNewAddress] = useState({ street: '', city: '', state: '', zipcode: '', country: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await axios.get('/api/user/addresses');
                setAddresses(response.data);
            } catch (error) {
                console.error('Error fetching addresses', error);
                setError('Error fetching addresses');
            }
        };
        fetchAddresses();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            setLoading(false);
            return;
        }

        const address = selectedAddress !== 'new' ? addresses.find(addr => addr.id === parseInt(selectedAddress)) : newAddress;

        if (!address) {
            setError('Address is required');
            setLoading(false);
            return;
        }

        const cardElement = elements.getElement(CardNumberElement);

        const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                address: {
                    line1: address.street,
                    city: address.city,
                    state: address.state,
                    postal_code: address.zipcode,
                    country: address.country,
                },
            },
        });

        if (stripeError) {
            console.error('Payment error:', stripeError);
            setError('Payment error: ' + stripeError.message);
            setLoading(false);
            return;
        }

        try {
            console.log('Sending data:', {
                payment_method_id: paymentMethod.id,
                address,
            });

            const response = await axios.post('/api/checkout', {
                payment_method_id: paymentMethod.id,
                address,
            });

            console.log('Order placed successfully', response.data);
            // Afficher un message de succès
            setError('Order placed successfully!');
            history.push('/product'); // Redirection vers la page d'accueil
        } catch (error) {
            console.error('Error submitting order', error.response.data);
            setError('Error submitting order: ' + error.response.data.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Checkout</h1>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="address">Adresse :</label>
                    <select
                        id="address"
                        value={selectedAddress}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                    >
                        <option value="">-- Choisir une adresse --</option>
                        {addresses.map((address) => (
                            <option key={address.id} value={address.id}>
                                {address.street}, {address.city}, {address.state}, {address.zipcode}, {address.country}
                            </option>
                        ))}
                        <option value="new">Nouvelle adresse</option>
                    </select>
                </div>
                {selectedAddress === 'new' && (
                    <div>
                        <input
                            type="text"
                            placeholder="Street"
                            value={newAddress.street}
                            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="City"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="State"
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Zipcode"
                            value={newAddress.zipcode}
                            onChange={(e) => setNewAddress({ ...newAddress, zipcode: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Country"
                            value={newAddress.country}
                            onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                        />
                    </div>
                )}

                <div>
                    <label>Numéro de carte :</label>
                    <CardNumberElement />
                </div>
                <div>
                    <label>Date d'expiration :</label>
                    <CardExpiryElement />
                </div>
                <div>
                    <label>CVC :</label>
                    <CardCvcElement />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : 'Payer'}
                </button>
            </form>
        </div>
    );
};

export default Checkout;
