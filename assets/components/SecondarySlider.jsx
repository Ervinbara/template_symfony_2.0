// assets/components/SecondarySlider.jsx
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import '../styles/secondary-slider.css';

const SecondarySlider = () => {
    const [slides, setSlides] = useState([]);

    useEffect(() => {
        fetch('/api/secondary-sliders')
            .then(response => response.json())
            .then(data => setSlides(data));
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2.5, // Affiche deux images complètement et une partiellement
        slidesToScroll: 1,
        centerMode: true, // Centre la première image
        centerPadding: '40px', // Ajoute un espacement entre les images
        arrows: true, // Affiche les flèches de navigation
        appendDots: dots => (
            <div
                style={{
                    bottom: '10px',
                    position: 'absolute',
                    width: '100%',
                    textAlign: 'center',
                }}
            >
                <ul style={{ margin: '0px' }}> {dots} </ul>
            </div>
        ),
        customPaging: i => (
            <button style={{ backgroundColor: '#333', borderRadius: '50%', width: '10px', height: '10px' }} />
        ),
    };

    return (
        <div className="secondary-slider-container">
            <h2 className="slider-title">EN GARDE POUR GAGNER</h2>
            <p className="slider-subtitle">Phrase descriptive centrée sous le titre.</p>
            <div className="secondary-slider">
                <Slider {...settings}>
                    {slides.map((slide, index) => (
                        <div key={index} className="slider-item">
                            <img src={slide.src} alt={slide.altText} className="slider-image" />
                            {slide.caption && (
                                <div className="slider-text">
                                    <div className="text-content">
                                        <h3>{slide.caption}</h3>
                                        <button className="slider-button">En savoir plus</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default SecondarySlider;
