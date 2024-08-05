import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import '../../styles/SiteElements/banner.css';

const Banner = () => {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        // Récupère les bannières à partir de l'objet global
        const fetchedBanners = window.__BANNERS__;
        console.log('Fetched Banners:', fetchedBanners); // Debug: Affiche les données récupérées
        setBanners(fetchedBanners);
    }, []);

    const settings = {
        dots: banners.length > 1,
        infinite: banners.length > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: banners.length > 1,
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
