import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ProductList from './components/Product/ProductList';
import CartPage from './components/Payment/CartPage';
import Checkout from './components/Payment/Checkout';
import LoginForm from './components/Forms/LoginForm';
import HomePage from './components/Pages/HomePage';
import RegisterForm from './components/Forms/RegisterForm';
import ProductDetail from './components/Product/ProductDetail';
import { AuthProvider } from './components/Security/AuthContext';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProtectedRoute from './components/Security/ProtectedRoute';
import Header from './components/SiteElements/Header';
import SearchResults from './components/SiteElements/SearchResults';
import ProfilePage from './components/SiteElements/ProfilePage';
import Footer from './components/SiteElements/Footer';
import config from './components/Config/config';
import { CartProvider } from './components/contexts/CartContext'; // Assure-toi d'importer ton CartContext

const stripePromise = loadStripe(config.STRIPE_PUBLIC_KEY);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        {/* Fournisseurs de contexte */}
        <CartProvider>
            <AuthProvider>
                <Router>
                    {/* En-tête global */}
                    <Header />
                    {/* Configuration des routes */}
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/product" element={<ProductList />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route 
                            path="/checkout" 
                            element={
                                <ProtectedRoute>
                                    <Elements stripe={stripePromise}>
                                        <Checkout />
                                    </Elements>
                                </ProtectedRoute>
                            } 
                        />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/register" element={<RegisterForm />} />
                        <Route path="/logout" element={<HomePage />} />
                        <Route path="/search" element={<SearchResults />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
                    {/* Pied de page global */}
                    <Footer />
                </Router>
            </AuthProvider>
        </CartProvider>
    </React.StrictMode>
);
