import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import '../../styles/SiteElements/ThirdSlider.css';

const ThirdSlider = () => {
    const [slides, setSlides] = useState([]);

    useEffect(() => {
        // Lire les données depuis `window`
        const fetchedSlides = window.__THIRD_SLIDERS__;
        console.log('Fetched Third Sliders:', fetchedSlides); // Debug: Affiche les données récupérées
        setSlides(fetchedSlides);
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2.5,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '40px',
        arrows: true,
        appendDots: dots => (
            <div
                style={{
                    bottom: '10px',
                    position: 'absolute',
                    width: '100%',
                    textAlign: 'center',
                }}
            >
                <ul style={{ margin: '0px' }}>{dots}</ul>
            </div>
        ),
        customPaging: i => (
            <button style={{ backgroundColor: '#333', borderRadius: '50%', width: '10px', height: '10px' }} />
        ),
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: false,
                },
            },
        ],
    };

    return (
        <div className="third-slider-container">
            <div className="third-slider">
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

export default ThirdSlider;
