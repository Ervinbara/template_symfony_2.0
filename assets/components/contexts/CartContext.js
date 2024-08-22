import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Fetch cart when component mounts
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get('/api/cart');
                setCartItems(response.data.cartItems || []);
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        };

        fetchCart();
    }, []);

    // Function to add items to the cart
    const addToCart = async (productId, quantity = 1) => {
        try {
            const dataToSend = { product_id: productId, quantity };
            const response = await axios.post('/api/cart/add', dataToSend);

            // Fetch the updated cart after adding
            const updatedCartResponse = await axios.get('/api/cart');
            setCartItems(updatedCartResponse.data.cartItems || []);
        } catch (error) {
            console.error('Error adding to cart:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};
