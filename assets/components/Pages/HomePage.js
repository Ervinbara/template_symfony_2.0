// assets/components/Pages/HomePage.jsx
import React from 'react';
import Header from '../Header';
import Banner from '../Banner';
import '../../styles/banner.css';
import '../../styles/header.css';

const HomePage = () => {
    return (
        <div className="home-page">
            <Header />
            <Banner />
            <div className="container">
                <h1>Welcome to the Home Page!</h1>
                <p>This is a simple home page with some introductory content.</p>
                <p>Feel free to explore our products and services.</p>
            </div>
        </div>
    );
};

export default HomePage;
