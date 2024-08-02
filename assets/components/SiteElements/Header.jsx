import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const messages = [
    "Free Shipping on Orders Over $50!",
    "20% Off All New Arrivals!",
    "Buy One Get One Free on Select Items!",
    "Limited Time Offer: Extra 10% Off Sale Items!"
];

const fakeSuggestion = [
    "Air Force 1",
    "Jordan",
    "Air Max",
    "Blazer"
];

const Header = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [hovered, setHovered] = useState(false);
    const [navOpen, setNavOpen] = useState(false);
    const [searchSidebarOpen, setSearchSidebarOpen] = useState(false);
    const messageTimeoutRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (searchQuery) {
            const fetchSuggestions = async () => {
                try {
                    // Simuler une requête réseau avec les fausses suggestions
                    await new Promise(resolve => setTimeout(resolve, 500));
                    setSuggestions(fakeSuggestion);
                } catch (error) {
                    console.error('Error fetching search suggestions:', error);
                }
            };
            fetchSuggestions();
        } else {
            setSuggestions([]);
        }
    }, [searchQuery]);

    useEffect(() => {
        const rotateMessages = () => {
            setCurrentMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
        };

        if (!hovered) {
            messageTimeoutRef.current = setInterval(rotateMessages, 1000);
        } else {
            clearInterval(messageTimeoutRef.current);
        }

        return () => clearInterval(messageTimeoutRef.current);
    }, [hovered]);

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${searchQuery}`);
        }
    };

    const toggleNav = () => {
        setNavOpen(!navOpen);
    };

    const closeNav = () => {
        setNavOpen(false);
    };

    const toggleSearchSidebar = () => {
        setSearchSidebarOpen(!searchSidebarOpen);
    };

    const closeSearchSidebar = () => {
        setSearchSidebarOpen(false);
    };

    return (
        <header className="header">
            {/* Top Band - Only visible on desktop */}
            <div className="top-bar">
                <div className="top-links">
                    <Link to="/store-locator">Trouver un magasin</Link>
                    <Link to="/help">Aide</Link>
                    <Link to="/join">Rejoins-nous</Link>
                    <Link to="/login">S'identifier</Link>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="main-nav">
                <div className="logo">
                    <Link to="/">
                        <img src="/path/to/logo.png" alt="Logo" />
                    </Link>
                </div>

                <div className="hamburger-menu" onClick={toggleNav}>
                    <i className="fa fa-bars"></i>
                </div>

                <ul className="nav-links">
                    <li><Link to="/new-arrivals">Nouveautés du moment</Link></li>
                    <li><Link to="/men">Homme</Link></li>
                    <li><Link to="/women">Femme</Link></li>
                    <li><Link to="/kids">Enfant</Link></li>
                    <li><Link to="/offers">Offres</Link></li>
                </ul>

                <div className="search-container">
                    <div className="search-bar">
                        <button className="search-icon" onClick={toggleSearchSidebar}>
                            <i className="fa fa-search"></i>
                        </button>
                        <form onSubmit={handleSearchSubmit}>
                            <input 
                                type="text" 
                                placeholder="Rechercher..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)} 
                                onFocus={() => setIsSearchOpen(true)}
                                onClick={toggleSearchSidebar}
                                onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                            />
                        </form>
                    </div>
                    <div className="icon-container">
                        <Link to="/favorites" className="icon">
                            <i className="fa fa-heart"></i>
                        </Link>
                        <Link to="/cart" className="icon">
                            <i className="fa fa-shopping-cart"></i>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Promo Banner */}
            <div className="promo-banner" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                <div className="message-container">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`message ${index === currentMessageIndex ? 'active' : 'inactive'}`}
                        >
                            {message}
                        </div>
                    ))}
                </div>
            </div>

            {/* Sidebar */}
            <div className={`sidebar ${navOpen ? 'open' : ''}`}>
                <button className="close-btn" onClick={closeNav}>&times;</button>
                <ul>
                    <li><Link to="/new-arrivals">Nouveautés du moment</Link></li>
                    <li><Link to="/men">Homme</Link></li>
                    <li><Link to="/women">Femme</Link></li>
                    <li><Link to="/kids">Enfant</Link></li>
                    <li><Link to="/offers">Offres</Link></li>
                    <hr />
                    <li><Link to="/store-locator">Trouver un magasin</Link></li>
                    <li><Link to="/help">Aide</Link></li>
                    <li><Link to="/join">Rejoins-nous</Link></li>
                    <li><Link to="/login">S'identifier</Link></li>
                </ul>
            </div>

            {/* Search Sidebar */}
            <div className={`search-sidebar ${searchSidebarOpen ? 'open' : ''}`}>
                <button className="cancel-btn" onClick={closeSearchSidebar}>Annuler</button>
                <div className="search-content">
                    <form onSubmit={handleSearchSubmit}>
                        <input 
                            type="text" 
                            placeholder="Rechercher..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} 
                        />
                        {fakeSuggestion.length > 0 && (
                            <div className="suggestions-box">
                                <p>Recherches populaires</p>
                                {fakeSuggestion.map((suggestion, index) => (
                                    <div key={index} className="suggestion-item">
                                        <span>{suggestion}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* Overlay */}
            {(navOpen || searchSidebarOpen) && <div className="overlay" onClick={() => { closeNav(); closeSearchSidebar(); }}></div>}
        </header>
    );
};

export default Header;
