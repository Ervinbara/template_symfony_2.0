// assets/app.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ProductList from './components/ProductList';
import CartPage from './components/CartPage';
import Checkout from './components/Checkout';
import Navbar from './components/Navbar';

const stripePromise = loadStripe('pk_test_51PhTvTKuzPUvarsT4RFUKX7BKF1IBavWFROrhpi1zo0jpXafWwSwV4oFYfdWpz8ckvMvH19i2ULzSgmY717bths700WxYSSvQU');

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <Router>
            <Navbar />
            <Routes>
                <Route path="/product" element={<ProductList />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={
                    <Elements stripe={stripePromise}>
                        <Checkout />
                    </Elements>
                } />
            </Routes>
        </Router>
    </React.StrictMode>
);
