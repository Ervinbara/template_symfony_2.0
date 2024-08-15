import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import RegisterPage from '../Pages/RegisterPage'; // Mettez le chemin correct vers votre composant

describe('RegisterPage', () => {
    test('renders the Register page correctly', () => {
        render(
            <Router>
                <RegisterPage />
            </Router>
        );

        // Vérifie si le titre de la page s'affiche correctement
        expect(screen.getByText('Register')).toBeInTheDocument();

        // Vérifie si le bouton Register est présent
        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();

        // Vérifie si le lien vers la page de connexion est présent
        expect(screen.getByText(/back to login/i)).toBeInTheDocument();
    });

    test('displays error when passwords do not match', () => {
        render(
            <Router>
                <RegisterPage />
            </Router>
        );

        // Remplir les champs de mot de passe avec des valeurs différentes
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password1' } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password2' } });

        // Soumettre le formulaire
        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        // Vérifie si le message d'erreur est affiché
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });

    test('submits the form with correct data', async () => {
        render(
            <Router>
                <RegisterPage />
            </Router>
        );

        // Remplir les champs du formulaire avec des valeurs valides
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password' } });

        // Mock de la fonction fetch
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
            })
        );

        // Soumettre le formulaire
        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        // Vérifie si la redirection vers la page de login est effectuée
        expect(global.fetch).toHaveBeenCalledWith(
            '/register',
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'test@example.com', password: 'password', confirmPassword: 'password' }),
            })
        );
    });
});
