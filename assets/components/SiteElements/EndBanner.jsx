import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import '../../styles/SiteElements/end-banner.css';

const EndBanner = () => {
    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch('/api/end-banners'); // Modifier l'URL si nécessaire
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setBanners(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBanners();
    }, []);

    const settings = {
        dots: banners.length > 1,
        infinite: banners.length > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: banners.length > 1,
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="endBanner-container">
            {banners.length > 0 ? (
                <Slider {...settings}>
                    {banners.map((banner, index) => (
                        <div key={index} className="endBanner-item">
                            {banner.type === 'image' ? (
                                <img src={banner.src} alt={banner.altText} />
                            ) : (
                                <video controls>
                                    <source src={banner.src} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                    ))}
                </Slider>
            ) : (
                <p>No banners to display</p>
            )}
        </div>
    );
};

export default EndBanner;
