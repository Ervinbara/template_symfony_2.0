// assets/context/auth-context.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/check-auth');
                const data = await response.json();
                setIsAuthenticated(data.isAuthenticated);
            } catch (error) {
                console.error('Erreur de vérification d\'authentification:', error);
            }
        };

        checkAuth();
    }, []);

    // Fonction pour gérer la déconnexion
    const logout = async () => {
        try {
            await fetch('/logout', {
                method: 'POST', // ou 'GET' selon votre configuration Symfony
                credentials: 'include' // Assurez-vous que les cookies de session sont envoyés avec la requête
            });
            setIsAuthenticated(false);
            window.location.href = '/'; // Redirection après déconnexion
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
