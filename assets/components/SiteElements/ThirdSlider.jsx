import React, { useEffect, useState, useRef } from 'react';
import '../../styles/SiteElements/ThirdSlider.css';

const ThirdSlider = () => {
    const [slides, setSlides] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const response = await fetch('/api/third-sliders'); // URL de l'API
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSlides(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSlides();
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

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error fetching slides: {error}</p>;
    }

    return (
        <div className="third-slider-container carousel">
            <button className="slick-prev" onClick={scrollLeft}></button>
            <div className="third-slider scroll-slider" ref={scrollContainerRef}>
                {slides.length > 0 ? (
                    slides.map((slide, index) => (
                        <div key={index} className="slider-item">
                            <img src={slide.src} alt={slide.altText || 'Slide Image'} className="slider-image" />
                            {slide.caption && (
                                <div className="slider-text">
                                    <div className="text-content">
                                        <h3>{slide.caption}</h3>
                                        <button className="slider-button">En savoir plus</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No slides to display</p>
                )}
            </div>
            <button className="slick-next" onClick={scrollRight}></button>
        </div>
    );
};

export default ThirdSlider;
