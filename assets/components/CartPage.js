import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CartPage = () => {
    // États pour gérer les éléments du panier, le chargement et les erreurs
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Utilisation de useEffect pour charger les éléments du panier au montage du composant
    useEffect(() => {
        // Fonction asynchrone pour récupérer les éléments du panier depuis l'API
        const fetchCart = async () => {
            try {
                // Requête GET pour obtenir les données du panier
                const response = await axios.get('/api/cart');
                // Met à jour l'état local avec les éléments du panier récupérés
                setCartItems(response.data.cartItems || []);
            } catch (error) {
                // Gestion des erreurs lors du chargement des données
                console.error('Erreur lors du chargement du panier', error);
                setError('Erreur lors du chargement du panier');
            } finally {
                // Met à jour l'état pour indiquer que le chargement est terminé
                setLoading(false);
            }
        };

        fetchCart(); // Appel de la fonction pour récupérer les données du panier
    }, []); // Dépendance vide pour que l'effet ne s'exécute qu'au montage

    // Fonction pour mettre à jour la quantité d'un élément dans le panier
    const updateCartItem = async (cartItemId, quantity) => {
        try {
            // Requête POST pour mettre à jour la quantité de l'élément du panier
            const response = await axios.post('/api/cart/update', {
                cart_item_id: cartItemId,
                quantity: quantity,
            });

            // Met à jour l'état local avec les nouvelles données du panier
            setCartItems(response.data.cartItems || []);
        } catch (error) {
            // Gestion des erreurs lors de la mise à jour de la quantité
            console.error('Erreur lors de la mise à jour de la quantité', error);
            setError('Erreur lors de la mise à jour de la quantité');
        }
    };

    // Fonction pour supprimer un élément du panier
    const removeCartItem = async (cartItemId) => {
        try {
            // Requête POST pour supprimer l'élément du panier
            await axios.post('/api/cart/remove', {
                cart_item_id: cartItemId,
            });
    
            // Met à jour l'état local en supprimant l'élément du panier
            setCartItems(prevItems => 
                prevItems.filter(item => item.id !== cartItemId)
            );
        } catch (error) {
            // Gestion des erreurs lors de la suppression de l'élément
            console.error('Erreur lors de la suppression de l\'élément du panier', error);
            setError('Erreur lors de la suppression de l\'élément du panier');
        }
    };

    // Fonction pour gérer le changement de quantité d'un élément
    const handleQuantityChange = (cartItemId, newQuantity) => {
        if (newQuantity < 1) return; // Ne permet pas de quantité négative

        // Optimistic UI Update: Met à jour l'état local immédiatement
        setCartItems(prevItems => 
            prevItems.map(item => 
                item.id === cartItemId ? { ...item, quantity: newQuantity } : item
            )
        );

        // Envoie la mise à jour de la quantité au serveur
        updateCartItem(cartItemId, newQuantity);
    };

    // Fonction pour gérer l'incrémentation de la quantité d'un élément
    const handleIncrement = (cartItemId, currentQuantity) => {
        handleQuantityChange(cartItemId, currentQuantity + 1);
    };

    // Fonction pour gérer la décrémentation de la quantité d'un élément
    const handleDecrement = (cartItemId, currentQuantity) => {
        handleQuantityChange(cartItemId, currentQuantity - 1);
    };

    // Affiche un message de chargement si les données sont en cours de chargement
    if (loading) return <p>Chargement...</p>;

    // Affiche un message d'erreur s'il y a eu un problème lors du chargement
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Votre Panier</h1>
            {cartItems.length === 0 ? (
                // Affiche un message si le panier est vide
                <p>Le panier est vide</p>
            ) : (
                <ul>
                    {cartItems.map(item => (
                        <li key={item.id}>
                            <span>{item.product.name} - </span>
                            {/* Bouton pour décrémenter la quantité */}
                            <button onClick={() => handleDecrement(item.id, item.quantity)}>-</button>
                            <span>{item.quantity}</span>
                            {/* Bouton pour incrémenter la quantité */}
                            <button onClick={() => handleIncrement(item.id, item.quantity)}>+</button>
                            {/* Bouton pour supprimer l'élément du panier */}
                            <button onClick={() => removeCartItem(item.id)}>Supprimer</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CartPage;
