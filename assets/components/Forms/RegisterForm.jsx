// assets/components/Pages/RegisterPage.jsx
import React, { useState } from 'react';
import '../../styles/AuthPage.css'; // Importation des styles spécifiques

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, confirmPassword })
            });

            if (response.ok) {
                window.location.href = '/login'; // Redirection vers la page de connexion
            } else {
                const data = await response.json();
                setError(data.error || 'Registration failed');
            }
        } catch (error) {
            setError('An error occurred: ' + error.message);
        }
    };

    return (
        <div className="auth-page">
            <header className="auth-header">
                <img src="/path/to/logo.png" alt="Logo" className="auth-logo" />
                <h1 className="auth-title">Register</h1>
            </header>

            <main className="auth-main">
                <p className="auth-message">Create an account to get started.</p>
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
                    <div className="form-group">
                        <label htmlFor="confirm-password">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="submit-button">Register</button>
                </form>
                <div className="auth-links">
                    <a href="/login">Back to Login</a>
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

export default RegisterPage;
