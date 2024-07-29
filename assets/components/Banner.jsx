// assets/components/Banner.jsx
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';

const Banner = () => {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch('/api/banners');
                const data = await response.json();
                setBanners(data);
            } catch (error) {
                console.error('Error fetching banners:', error);
            }
        };

        fetchBanners();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: banners.length > 1
    };

    return (
        <div className="banner-container">
            {banners.length > 0 ? (
                <Slider {...settings}>
                    {banners.map((banner, index) => (
                        <div key={index} className="banner-item">
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

export default Banner;
