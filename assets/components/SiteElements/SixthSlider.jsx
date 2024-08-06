import React, { useEffect, useState, useRef } from 'react';
import '../../styles/SiteElements/SixthSlider.css';

const SixthSlider = () => {
    const [slides, setSlides] = useState([]);
    const [error, setError] = useState(null);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const fetchedSlides = window.__SIXTH_SLIDERS__;
        if (fetchedSlides) {
            setSlides(fetchedSlides);
        } else {
            setError('No data available');
        }
    }, []);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            const itemWidth = scrollContainerRef.current.querySelector('.slider-item').offsetWidth;
            scrollContainerRef.current.scrollBy({
                left: -itemWidth,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            const itemWidth = scrollContainerRef.current.querySelector('.slider-item').offsetWidth;
            scrollContainerRef.current.scrollBy({
                left: itemWidth,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="sixth-slider-container carousel">
            {error ? (
                <p>Error fetching slides: {error}</p>
            ) : (
                <>
                    <button className="slick-prev" onClick={scrollLeft}></button>
                    <div className="sixth-slider scroll-slider" ref={scrollContainerRef}>
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
                    </div>
                    <button className="slick-next" onClick={scrollRight}></button>
                </>
            )}
        </div>
    );
};

export default SixthSlider;
