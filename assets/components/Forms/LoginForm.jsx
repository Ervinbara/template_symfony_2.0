// assets/components/Forms/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Assurez-vous du bon chemin

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { setIsAuthenticated } = useAuth(); // Accédez à setIsAuthenticated depuis le contexte

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
                // Mettez à jour le contexte d'authentification
                setIsAuthenticated(true);
                navigate('/');
            } else {
                // Affichez une erreur si l'authentification échoue
                const errorText = await response.text();
                setError(errorText);
            }
        } catch (error) {
            // Affichez les erreurs de la requête
            setError('An error occurred: ' + error.message);
        }
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
            {error && <div className="error">{error}</div>}
            <div>
                <a href="/connect-google">Connect with Google</a>
            </div>
            <a href="/register">Register</a>
        </div>
    );
};

export default LoginForm;
