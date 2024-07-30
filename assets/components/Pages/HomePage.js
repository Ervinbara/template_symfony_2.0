// assets/components/Pages/HomePage.jsx
import React from 'react';
import Header from '../SiteElements/Header';
import Banner from '../SiteElements/Banner';
import SecondarySlider from '../SiteElements/SecondarySlider';
import '../../styles/SiteElements/banner.css';
import '../../styles/SiteElements/header.css';
import '../../styles/SiteElements/secondary-slider.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const HomePage = () => {
    return (
        <div className="home-page">
            <Banner />
            <SecondarySlider />
            <div className="container">
                <h1>Welcome to the Home Page!</h1>
                <p>This is a simple home page with some introductory content.</p>
                <p>Feel free to explore our products and services.</p>
            </div>
        </div>
    );
};

export default HomePage;
