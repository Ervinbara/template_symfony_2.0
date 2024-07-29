// assets/components/CartContext.jsx
import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (item) => setCartItems([...cartItems, item]);
    const isCartEmpty = () => cartItems.length === 0;

    return (
        <CartContext.Provider value={{ cartItems, addToCart, isCartEmpty }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
