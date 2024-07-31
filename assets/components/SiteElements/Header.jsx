// assets/components/SiteElements/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const messages = [
    "Free Shipping on Orders Over $50!",
    "20% Off All New Arrivals!",
    "Buy One Get One Free on Select Items!",
    "Limited Time Offer: Extra 10% Off Sale Items!"
];

const Header = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [hovered, setHovered] = useState(false);
    const messageTimeoutRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (searchQuery) {
            const fetchSuggestions = async () => {
                try {
                    const response = await axios.get(`/api/search-suggestions?query=${searchQuery}`);
                    setSuggestions(response.data);
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
            messageTimeoutRef.current = setInterval(rotateMessages, 3000); // Change message every 3 seconds
        } else {
            clearInterval(messageTimeoutRef.current); // Pause rotation on hover
        }

        return () => clearInterval(messageTimeoutRef.current); // Cleanup on unmount or hover change
    }, [hovered]);

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${searchQuery}`);
        }
    };

    return (
        <header className="header">
            {/* First Band */}
            <div className="top-bar">
                <div className="top-links">
                    <Link to="/store-locator">Trouver un magasin</Link>
                    <Link to="/help">Aide</Link>
                    <Link to="/join">Rejoins-nous</Link>
                    <Link to="/login">S'identifier</Link>
                </div>
            </div>

            {/* Second Band */}
            <div className="main-nav">
                <div className="logo">
                    <Link to="/">
                        <img src="/path/to/logo.png" alt="Logo" />
                    </Link>
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
                        <button className="search-icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                            <i className="fa fa-search"></i>
                        </button>
                        <form onSubmit={handleSearchSubmit}>
                            <input 
                                type="text" 
                                placeholder="Rechercher..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)} 
                                onFocus={() => setIsSearchOpen(true)}
                                onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                            />
                            {isSearchOpen && suggestions.length > 0 && (
                                <div className="suggestions-box">
                                    {suggestions.map((suggestion, index) => (
                                        <div key={index} className="suggestion-item">
                                            <img src={suggestion.image} alt={suggestion.name} />
                                            <span>{suggestion.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
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

            {/* Third Band */}
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
        </header>
    );
};

export default Header;
