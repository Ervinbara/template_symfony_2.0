// assets/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="header">
            <div className="promo-banner">
                <p>Free Shipping on Orders Over $50!</p>
            </div>
            <div className="top-bar">
                <div className="logo">
                    <Link to="/">
                        <img src="/path/to/logo.png" alt="Logo" />
                    </Link>
                </div>
                <div className="util-links">
                    <Link to="/store-locator">Trouver un magasin</Link>
                    <Link to="/help">Aide</Link>
                    <Link to="/login">S'identifier</Link>
                </div>
            </div>
            <nav className="navbar">
                <ul>
                    <li><Link to="/new-arrivals">Nouveautés</Link></li>
                    <li><Link to="/men">Homme</Link></li>
                    <li><Link to="/women">Femme</Link></li>
                    <li><Link to="/kids">Enfant</Link></li>
                    <li><Link to="/offers">Offres</Link></li>
                </ul>
                <div className="search-bar">
                    <input type="text" placeholder="Rechercher..." />
                    <button type="submit"><i className="fa fa-search"></i></button>
                </div>
            </nav>
        </header>
    );
};

export default Header;
