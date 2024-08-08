// assets/components/Footer.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/SiteElements/footer.css';

const Footer = () => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/cart';

    if (isAuthPage) {
        return null; // Hide the footer on login and register pages
    }

    return (
        <footer className="footer-container">
            <div className="footer-top">
                <div className="footer-column">
                    <h3>ABOUT NIKE</h3>
                    <ul>
                        <li><a href="#">News</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Investors</a></li>
                        <li><a href="#">Sustainability</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>HELP</h3>
                    <ul>
                        <li><a href="#">Order Status</a></li>
                        <li><a href="#">Shipping & Delivery</a></li>
                        <li><a href="#">Returns</a></li>
                        <li><a href="#">Payment Options</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>COMMUNITY</h3>
                    <ul>
                        <li><a href="#">Diversity & Inclusion</a></li>
                        <li><a href="#">Community Impact</a></li>
                        <li><a href="#">Student Athletes</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>FOLLOW US</h3>
                    <ul className="social-icons">
                        <li><a href="#"><i className="fab fa-facebook"></i> Facebook</a></li>
                        <li><a href="#"><i className="fab fa-instagram"></i> Instagram</a></li>
                        <li><a href="#"><i className="fab fa-twitter"></i> Twitter</a></li>
                        <li><a href="#"><i className="fab fa-youtube"></i> YouTube</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 Nike, Inc. All Rights Reserved</p>
                <ul className="legal-links">
                    <li><a href="#">Terms of Use</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Cookie Settings</a></li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;
