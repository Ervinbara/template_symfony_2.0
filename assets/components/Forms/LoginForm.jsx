// assets/components/Forms/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Effectuer la connexion via fetch ou axios
        fetch('/login_check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ _username: email, _password: password })
        })
        .then(response => {
            if (response.ok) {
                navigate('/'); // Redirection après connexion réussie
            } else {
                // Gestion des erreurs
                console.error('Login failed');
            }
        });
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="_username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="_password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <div>
                <a href="/connect-google">Connect with Google</a>
            </div>
            <a href="/register">Register</a>
        </div>
    );
};

export default LoginForm;
