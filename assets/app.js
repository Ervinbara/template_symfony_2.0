// assets/app.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './components/ProductList';
import CartPage from './components/CartPage';
import Checkout from './components/Checkout';
import Navbar from './components/Navbar';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <Router>
            <Navbar />
            <Routes>
                <Route path="/product" element={<ProductList />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<Checkout />} />
            </Routes>
        </Router>
    </React.StrictMode>
);
