import React, { useEffect, useState, useRef } from 'react';
import '../../styles/SiteElements/FourthSlider.css';

const FourthSlider = () => {
    const [slides, setSlides] = useState([]);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const fetchedSlides = window.__FOURTH_SLIDERS__;
        console.log('Fetched Fourth Sliders:', fetchedSlides);
        setSlides(fetchedSlides);
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
        <div className="fourth-slider-container carousel">
            <button className="slick-prev" onClick={scrollLeft}></button>
            <div className="fourth-slider scroll-slider" ref={scrollContainerRef}>
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
            </div>
            <button className="slick-next" onClick={scrollRight}></button>
        </div>
    );
};

export default FourthSlider;
