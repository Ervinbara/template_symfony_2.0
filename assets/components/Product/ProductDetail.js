import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Pages/ProductDetail.css';
import { CartContext } from '../contexts/CartContext';  // Importer le contexte du panier

const ProductDetail = () => {
    const { id } = useParams(); 
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null); 
    const [successMessage, setSuccessMessage] = useState('');
    const { addToCart } = useContext(CartContext);  // Utiliser le contexte du panier

    const fakeSizes = ['39', '40', '41', '42', '43']; 

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching product details');
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Please select a size before adding to cart.');
            return;
        }

        addToCart(product.id, 1);  // Ajouter le produit au panier avec la taille sélectionnée
        setSuccessMessage('Produit ajouté au panier avec succès !');
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!product) return <p>No product found.</p>;

    return (
        <div className="product-detail-container">
            <div className="product-image">
                <img src={product.image} alt={product.name} />
            </div>
            <div className="product-details">
                <h1>{product.name}</h1>
                <p className="product-detail-price">Price: {product.price} €</p>
                <p className="product-detail-description">{product.description}</p>

                {/* Sélecteur de taille */}
                <div className="size-selector">
                    <p>Select Size:</p>
                    <div className="sizes">
                        {fakeSizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <button onClick={handleAddToCart} className="add-to-cart-button">Add to Cart</button>
                {successMessage && <p className="success-message">{successMessage}</p>}
                <Link to="/product" className="back-button">Back to Products</Link>
            </div>
        </div>
    );
};

export default ProductDetail;
