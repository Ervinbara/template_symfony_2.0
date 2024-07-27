import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import '../styles/ProductList.css'; // Import des styles
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Fetch products from the Symfony backend
        fetch('/api/products')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched products:', data);
                setProducts(data['hydra:member']);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const addToCart = (productId) => {
        console.log(`Adding product ID: ${productId} to cart`);
        axios.post('/api/cart/add', { product_id: productId, quantity: 1 })
            .then(response => {
                console.log('Product added to cart:', response.data);
            })
            .catch(error => console.error('Error adding to cart:', error));
    };

    return (
        <div className="container product-list">
            <h1 className="product-list-title">Liste des Produits</h1>
            {products.length > 0 ? (
                <div className="row product-list-grid">
                    {products.map(product => (
                        <div className="col-md-4" key={product.id}>
                            <ProductCard product={product} addToCart={addToCart} />
                        </div>
                    ))}
                </div>
            ) : (
                <p>Aucun produit trouvé.</p>
            )}
        </div>
    );
};

export default ProductList;
