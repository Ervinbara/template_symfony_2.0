import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../Product/ProductCard';
import '../../styles/SiteElements/ProductList.css';

const SearchResults = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    // Fetch all products on initial load
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products');
                const productsData = response.data['hydra:member'];
                if (Array.isArray(productsData)) {
                    setProducts(productsData);
                    setFilteredProducts(productsData);
                } else {
                    console.error('Les données extraites ne sont pas un tableau:', productsData);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des produits:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Filter products based on search query
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const query = queryParams.get('query');

        if (query) {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [location.search, products]);

    // Function to add a product to the cart
    const addToCart = async (productId) => {
        console.log(`Adding product ID: ${productId} to cart`);

        try {
            const dataToSend = { product_id: productId, quantity: 1 };
            console.log('Data being sent to the server:', dataToSend);

            const response = await axios.post('/api/cart/add', dataToSend);
            console.log('Server response after adding product:', response.data);

            // Optionally, update cart state or display a success message here

        } catch (error) {
            console.error('Error adding to cart:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="container product-list">
            <h1 className="product-list-title">Résultats de recherche</h1>
            {loading ? (
                <p>Chargement...</p>
            ) : filteredProducts.length > 0 ? (
                <div className="product-list-content">
                    <div className="product-list-grid">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} addToCart={addToCart} />
                        ))}
                    </div>
                </div>
            ) : (
                <p>Aucun produit trouvé.</p>
            )}
        </div>
    );
};

export default SearchResults;
