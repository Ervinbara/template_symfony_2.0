import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import '../../styles/SiteElements/ProductList.css';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('/api/categories');
                setCategories(data['hydra:member']);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('/api/products');
                setProducts(data['hydra:member']);
                setFilteredProducts(data['hydra:member']); 
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const filterProducts = () => {
        if (selectedCategory === '') {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product => product.category.id.toString() === selectedCategory);
            setFilteredProducts(filtered);
        }
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleSearchClick = () => {
        filterProducts();
    };

    const calculateCartTotal = (cartItems) => {
        return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2);
    };
    
    const addToCart = async (productId) => {
        console.log(`Adding product ID: ${productId} to cart`);
    
        try {
            const dataToSend = { product_id: productId, quantity: 1 };
            console.log('Data being sent to the server:', dataToSend);
    
            const response = await axios.post('/api/cart/add', dataToSend);
            console.log('Server response after adding product:', response.data);
    
            const updatedCartResponse = await axios.get('/api/cart');
            const updatedCartItems = updatedCartResponse.data.cartItems || [];
            
            console.log('Updated cart items:', updatedCartItems);
    
            const cartTotal = calculateCartTotal(updatedCartItems);
            console.log('Updated Cart Total:', cartTotal);
    
        } catch (error) {
            console.error('Error adding to cart:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="container product-list">
            <h1 className="product-list-title">Liste des Produits</h1>
            <div className="product-list-content">
                <div className="filter-container">
                    <h2>Filtrer par catégorie</h2>
                    <select id="category-select" value={selectedCategory} onChange={handleCategoryChange}>
                        <option value="">Toutes les catégories</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                    <button onClick={handleSearchClick}>Rechercher</button>
                </div>
                <div className="product-list-grid">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} addToCart={addToCart} />
                        ))
                    ) : (
                        <p>Aucun produit trouvé.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;
