import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Pages/ProductDetail.css'; // Assurez-vous d'avoir ce fichier CSS

const ProductDetail = () => {
    const { id } = useParams(); // Récupérer l'ID du produit depuis l'URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null); // État pour la taille sélectionnée

    const fakeSizes = ['39', '40', '41', '42', '43']; // Fausses données pour les tailles

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`); // Utiliser l'ID dans l'URL de la requête
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

    const addToCart = async () => {
        if (!selectedSize) {
            alert('Please select a size before adding to cart.');
            return;
        }

        try {
            const dataToSend = { product_id: product.id, quantity: 1, size: selectedSize }; // Ajoutez la taille ici
            console.log('Data being sent to the server:', dataToSend);

            const response = await axios.post('/api/cart/add', dataToSend);
            console.log('Server response after adding product:', response.data);

            // Optionnel : afficher un message ou mettre à jour l'état du panier
            // alert('Product added to cart successfully!');
        } catch (error) {
            console.error('Error adding to cart:', error.response ? error.response.data : error.message);
        }
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
                <p className="product-detail-price">Price: ${product.price}</p>
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

                <button onClick={addToCart} className="add-to-cart-button">Add to Cart</button>
                <Link to="/product" className="back-button">Back to Products</Link>
            </div>
        </div>
    );
};

export default ProductDetail;
