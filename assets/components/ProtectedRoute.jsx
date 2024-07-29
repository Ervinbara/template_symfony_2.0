// assets/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const { isCartEmpty } = useCart();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (isCartEmpty()) {
        return <Navigate to="/cart" />;
    }

    return children;
};

export default ProtectedRoute;
