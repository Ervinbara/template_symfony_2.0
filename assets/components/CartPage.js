// assets/components/CartPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Charger les éléments du panier depuis l'API
        const fetchCart = async () => {
            try {
                const response = await axios.get('/api/cart');
                setCartItems(response.data.cartItems || []);
            } catch (error) {
                console.error('Erreur lors du chargement du panier', error);
                setError('Erreur lors du chargement du panier');
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const updateCartItem = async (cartItemId, quantity) => {
        try {
            const response = await axios.post('/api/cart/update', {
                cart_item_id: cartItemId,
                quantity: quantity,
            });

            // Mettre à jour l'état local avec les nouvelles données du panier
            setCartItems(response.data.cartItems || []);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la quantité', error);
            setError('Erreur lors de la mise à jour de la quantité');
        }
    };

    const removeCartItem = async (cartItemId) => {
        try {
            await axios.post('/api/cart/remove', {
                cart_item_id: cartItemId,
            });
    
            // Mettre à jour l'état local en supprimant l'élément du panier
            setCartItems(prevItems => 
                prevItems.filter(item => item.id !== cartItemId)
            );
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'élément du panier', error);
            setError('Erreur lors de la suppression de l\'élément du panier');
        }
    };
    

    const handleQuantityChange = (cartItemId, newQuantity) => {
        if (newQuantity < 1) return; // Ne permet pas de quantité négative

        // Optimistic UI Update: Mettre à jour l'état local immédiatement
        setCartItems(prevItems => 
            prevItems.map(item => 
                item.id === cartItemId ? { ...item, quantity: newQuantity } : item
            )
        );

        // Envoyer la mise à jour au serveur
        updateCartItem(cartItemId, newQuantity);
    };

    const handleIncrement = (cartItemId, currentQuantity) => {
        handleQuantityChange(cartItemId, currentQuantity + 1);
    };

    const handleDecrement = (cartItemId, currentQuantity) => {
        handleQuantityChange(cartItemId, currentQuantity - 1);
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Votre Panier</h1>
            {cartItems.length === 0 ? (
                <p>Le panier est vide</p>
            ) : (
                <ul>
                    {cartItems.map(item => (
                        <li key={item.id}>
                            <span>{item.product.name} - </span>
                            <button onClick={() => handleDecrement(item.id, item.quantity)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => handleIncrement(item.id, item.quantity)}>+</button>
                            <button onClick={() => removeCartItem(item.id)}>Supprimer</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CartPage;
