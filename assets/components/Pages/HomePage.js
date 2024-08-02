// assets/components/Pages/HomePage.jsx
import React from 'react';
import Header from '../SiteElements/Header';
import Banner from '../SiteElements/Banner';
import SecondarySlider from '../SiteElements/SecondarySlider';
import ThirdSlider from '../SiteElements/ThirdSlider';
import FourthSlider from '../SiteElements/FourthSlider';
import '../../styles/SiteElements/banner.css';
import '../../styles/SiteElements/header.css';
import '../../styles/SiteElements/header.css';
import '../../styles/Pages/HomePage.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const HomePage = () => {
    return (
        <div class="home-page">
            <Banner />
            <div className="centered-text">
                <h2 className="first-title">EN GARDE POUR GAGNER</h2>
                <p className="first-subtitle">Phrase descriptive centrée sous le titre.</p>
            </div>
            <p>En ce moment</p>
            <SecondarySlider />
            <p>Nos modèles iconiques</p>
            <ThirdSlider />
            <p>Tout pour ton sport</p>
            <FourthSlider />
        </div>
    );
};

export default HomePage;
