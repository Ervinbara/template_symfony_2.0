import React from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/SiteElements/footer.css';

const Footer = () => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/cart' || location.pathname === '/checkout' || /^\/product\/\d+/.test(location.pathname);

    if (isAuthPage) {
        return null; // Hide the footer on login and register pages
    }

    return (
        <footer className="footer-container">
            <div className="footer-top">
                <div className="footer-column">
                    <h3>GIFT CARDS</h3>
                    <ul>
                        <li><a href="#">Find a Store</a></li>
                        <li><a href="#">Sign Up for Email</a></li>
                        <li><a href="#">Become a Member</a></li>
                        <li><a href="#">Student Discount</a></li>
                        <li><a href="#">Nike Journal</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>GET HELP</h3>
                    <ul>
                        <li><a href="#">Order Status</a></li>
                        <li><a href="#">Shipping & Delivery</a></li>
                        <li><a href="#">Returns</a></li>
                        <li><a href="#">Payment Options</a></li>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </div>
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
                    <h3>FOLLOW US</h3>
                    <ul className="social-icons">
                        <li><a href="#"><i className="fab fa-facebook"></i></a></li>
                        <li><a href="#"><i className="fab fa-instagram"></i></a></li>
                        <li><a href="#"><i className="fab fa-twitter"></i></a></li>
                        <li><a href="#"><i className="fab fa-youtube"></i></a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="footer-country-lang">
                    <a href="#">France</a> | <a href="#">French</a>
                </div>
                <div className="legal-section">
                    <ul className="legal-links">
                        <li><a href="#">Guides</a></li>
                        <li><a href="#">Terms of Sale</a></li>
                        <li><a href="#">Terms of Use</a></li>
                        <li><a href="#">Nike Privacy Policy</a></li>
                    </ul>
                    <p>&copy; 2024 Nike, Inc. All Rights Reserved</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
