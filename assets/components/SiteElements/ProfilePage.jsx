import React, { useState, useEffect } from 'react';
import '../../styles/Pages/ProfilePage.css';

const ProfilePage = () => {
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        addresses: []
    });
    const [error, setError] = useState(null);
    const [newAddress, setNewAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('/profile');
                const data = await response.json();
                setProfile(data);
            } catch (error) {
                setError('Failed to fetch profile data.');
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setNewAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value
        }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile)
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const updatedProfile = await response.json();
            setProfile(updatedProfile);
            setError(null);
        } catch (error) {
            setError('Failed to update profile.');
        }
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/profile/address', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAddress)
            });

            if (!response.ok) {
                throw new Error('Failed to add address');
            }

            const updatedProfile = await response.json();
            setProfile(updatedProfile);
            setNewAddress({
                street: '',
                city: '',
                state: '',
                zipcode: '',
                country: ''
            });
            setError(null);
        } catch (error) {
            setError('Failed to add address.');
        }
    };

    return (
        <div className="profile-page">
            <h1>Profile Page</h1>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleProfileSubmit} className="profile-form">
                <div className="form-group">
                    <label htmlFor="firstName">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Update Profile</button>
            </form>

            <h2>Add Address</h2>
            <form onSubmit={handleAddressSubmit} className="address-form">
                <div className="form-group">
                    <label htmlFor="street">Street:</label>
                    <input
                        type="text"
                        id="street"
                        name="street"
                        value={newAddress.street}
                        onChange={handleAddressChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="city">City:</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={newAddress.city}
                        onChange={handleAddressChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="state">State:</label>
                    <input
                        type="text"
                        id="state"
                        name="state"
                        value={newAddress.state}
                        onChange={handleAddressChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="zipcode">Zipcode:</label>
                    <input
                        type="text"
                        id="zipcode"
                        name="zipcode"
                        value={newAddress.zipcode}
                        onChange={handleAddressChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="country">Country:</label>
                    <input
                        type="text"
                        id="country"
                        name="country"
                        value={newAddress.country}
                        onChange={handleAddressChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Add Address</button>
            </form>

            <h2>My Addresses</h2>
            <ul>
                {profile.addresses.map((address) => (
                    <li key={address.id}>
                        {address.street}, {address.city}, {address.state}, {address.zipcode}, {address.country}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProfilePage;
