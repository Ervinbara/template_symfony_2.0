import React, { useEffect, useState } from 'react';

const useImageCache = (url) => {
    const [src, setSrc] = useState(null);

    useEffect(() => {
        const cachedImage = localStorage.getItem(url);
        if (cachedImage) {
            setSrc(cachedImage);
        } else {
            fetch(url)
                .then(response => response.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64data = reader.result;
                        localStorage.setItem(url, base64data);
                        setSrc(base64data);
                    };
                    reader.readAsDataURL(blob);
                });
        }
    }, [url]);

    return src;
};

const CachedImage = ({ src, alt }) => {
    const cachedSrc = useImageCache(src);

    if (!cachedSrc) return <p>Loading...</p>;

    return <img src={cachedSrc} alt={alt} />;
};

const Banner = () => {
    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch('/api/banners');
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

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="banner-container">
            {banners.length > 0 ? (
                banners.map((banner, index) => (
                    <div key={index} className="banner-item">
                        {banner.type === 'image' ? (
                            <CachedImage src={banner.src} alt={banner.altText} />
                        ) : (
                            <video controls>
                                <source src={banner.src} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </div>
                ))
            ) : (
                <p>No banners to display</p>
            )}
        </div>
    );
};

export default Banner;
