import React from 'react';
import ReactDOM from 'react-dom/client'; // Assurez-vous que cela est présent
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ProductList from './components/Product/ProductList';
import CartPage from './components/Payment/CartPage';
import Checkout from './components/Payment/Checkout';
import Navbar from './components/Navbar';
import LoginForm from './components/Forms/LoginForm';
import HomePage from './components/Pages/HomePage';
import RegisterForm from './components/Forms/RegisterForm';
import { AuthProvider } from './components/AuthContext';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import ProtectedRoute from './components/ProtectedRoute'; // Assurez-vous que c'est importé correctement

const stripePromise = loadStripe('pk_test_51PhTvTKuzPUvarsT4RFUKX7BKF1IBavWFROrhpi1zo0jpXafWwSwV4oFYfdWpz8ckvMvH19i2ULzSgmY717bths700WxYSSvQU');

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <AuthProvider>
            <Router>
                {/* <Navbar /> */}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/product" element={<ProductList />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={
                        <ProtectedRoute>
                            <Elements stripe={stripePromise}>
                                <Checkout />
                            </Elements>
                        </ProtectedRoute>
                    } />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/logout" element={<HomePage />} />
                </Routes>
            </Router>
        </AuthProvider>
    </React.StrictMode>
);
