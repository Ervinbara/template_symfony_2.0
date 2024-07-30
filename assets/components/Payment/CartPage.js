import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Pages/CartPage.css';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
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

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const updateCartItem = async (cartItemId, quantity) => {
        try {
            const response = await axios.post('/api/cart/update', {
                cart_item_id: cartItemId,
                quantity: quantity,
            });
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
            setCartItems(prevItems => 
                prevItems.filter(item => item.id !== cartItemId)
            );
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'élément du panier', error);
            setError('Erreur lors de la suppression de l\'élément du panier');
        }
    };

    const handleQuantityChange = (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;

        setCartItems(prevItems => 
            prevItems.map(item => 
                item.id === cartItemId ? { ...item, quantity: newQuantity } : item
            )
        );

        updateCartItem(cartItemId, newQuantity);
    };

    const handleIncrement = (cartItemId, currentQuantity) => {
        handleQuantityChange(cartItemId, currentQuantity + 1);
    };

    const handleDecrement = (cartItemId, currentQuantity) => {
        handleQuantityChange(cartItemId, currentQuantity - 1);
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => 
            total + (item.product.price * item.quantity), 0
        ).toFixed(2);
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="cart-container">
            <h1>Votre Panier</h1>
            {cartItems.length === 0 ? (
                <p className="empty-cart-message">Le panier est vide</p>
            ) : (
                <ul className="cart-item-list">
                    {cartItems.map(item => (
                        <li key={item.id} className="cart-item">
                            <img src={item.product.imageUrl} alt={item.product.name} className="cart-item-image" />
                            <div className="cart-item-details">
                                <span className="cart-item-name">{item.product.name}</span>
                                <div className="cart-item-buttons">
                                    <button className="quantity-button" onClick={() => handleDecrement(item.id, item.quantity)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button className="quantity-button" onClick={() => handleIncrement(item.id, item.quantity)}>+</button>
                                </div>
                                <p className="cart-item-price">Prix: ${item.product.price.toFixed(2)}</p>
                                <button className="remove-button" onClick={() => removeCartItem(item.id)}>Supprimer</button>
                            </div>
                            <p className="cart-item-total">Total: ${(item.product.price * item.quantity).toFixed(2)}</p>
                        </li>
                    ))}
                </ul>
            )}
            <div className="cart-summary">
                <p className="cart-total">Total du Panier: ${calculateTotal()}</p>
                <button 
                    className="checkout-button" 
                    onClick={handleCheckout} 
                    disabled={cartItems.length === 0} // Désactiver le bouton si le panier est vide
                >
                    Valider la Commande
                </button>
            </div>
        </div>
    );
};

export default CartPage;
