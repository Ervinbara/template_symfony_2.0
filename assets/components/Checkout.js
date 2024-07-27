import React, { useState } from 'react';
import axios from 'axios';

const Checkout = () => {
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        // Vérifiez que les champs ne sont pas vides
        if (!address || !paymentMethod) {
            setError('Address and payment method are required');
            setLoading(false);
            return;
        }

        try {
            console.log('Sending data:', { address, payment_method: paymentMethod });

            const response = await axios.post('/api/checkout', JSON.stringify({
                address,
                payment_method: paymentMethod,
            }), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Commande validée', response.data);
            // Redirigez vers une page de confirmation ou affichez un message de succès
            // Exemple : redirection vers une page de confirmation
            // navigate('/confirmation');
        } catch (error) {
            console.error('Erreur lors de la soumission de la commande', error);
            setError('Erreur lors de la validation de la commande');
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
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="paymentMethod">Méthode de paiement :</label>
                    <select
                        id="paymentMethod"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required
                    >
                        <option value="">Choisissez une méthode</option>
                        <option value="visa">Visa</option>
                        <option value="mastercard">MasterCard</option>
                        <option value="paypal">PayPal</option>
                        {/* Ajoutez d'autres options de paiement si nécessaire */}
                    </select>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'En cours...' : 'Valider la commande'}
                </button>
            </form>
        </div>
    );
};

export default Checkout;
