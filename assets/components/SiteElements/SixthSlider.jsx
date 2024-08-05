import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import '../../styles/SiteElements/SixthSlider.css';

const SixthSlider = () => {
    const [slides, setSlides] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/product/latest')
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) });
                }
                return response.json();
            })
            .then(data => setSlides(data))
            .catch(error => {
                console.error('Error fetching slides:', error);
                setError(error.message);
            });
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
                <ul style={{ margin: '0px' }}> {dots} </ul>
            </div>
        ),
        customPaging: i => (
            <button
                style={{
                    backgroundColor: '#333',
                    borderRadius: '50%',
                    width: '10px',
                    height: '10px',
                    border: 'none',
                }}
            />
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
        <div className="sixth-slider-container">
            <div className="sixth-slider">
                {error ? (
                    <p>Error fetching slides: {error}</p>
                ) : (
                    <Slider {...settings}>
                        {slides.map((slide, index) => (
                            <div key={index} className="slider-item">
                                <img
                                    src={slide.src}
                                    alt={slide.altText || 'Product Image'}
                                    className="slider-image"
                                />
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
                )}
            </div>
        </div>
    );
};

export default SixthSlider;
