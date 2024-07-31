import React, { useState } from 'react';
import '../../styles/Pages/AuthPage.css'; // Importation des styles spécifiques

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/login_check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    _username: email,
                    _password: password
                })
            });

            if (response.ok) {
                // Authentification réussie
                window.location.href = '/'; // Redirection vers la page d'accueil
            } else {
                // Affichage des erreurs
                const errorText = await response.text();
                setError(errorText);
            }
        } catch (error) {
            setError('An error occurred: ' + error.message);
        }
    };

    return (
        <div className="auth-page">
            <header className="auth-header">
                <img src="/path/to/logo.png" alt="Logo" className="auth-logo" />
                <h1 className="auth-title">Login</h1>
            </header>

            <main className="auth-main">
                <p className="auth-message">Enter your email and password to log in.</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="submit-button">Login</button>
                </form>

                {/* Google Login Button */}
                <div className="google-login">
                    <a href="/connect-google" className="google-login-button">
                        Connect with Google
                    </a>
                </div>

                <div className="auth-links">
                    <a href="/register">Register</a>
                </div>
            </main>

            <footer className="auth-footer">
                <a href="/terms-of-use" className="footer-link">Terms of Use</a>
                <a href="/privacy-policy" className="footer-link">Privacy Policy</a>
                <a href="/contact-us" className="footer-link">Contact Us</a>
            </footer>
        </div>
    );
};

export default LoginPage;
