import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import '../../styles/SiteElements/ProductList.css';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    // Fetch categories on component mount
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

    // Fetch products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('/api/products');
                setProducts(data['hydra:member']);
                setFilteredProducts(data['hydra:member']); // Initial display
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    // Filter products based on the selected category
    const filterProducts = () => {
        if (selectedCategory === '') {
            setFilteredProducts(products); // Show all products if no category selected
        } else {
            const filtered = products.filter(product => product.category.id.toString() === selectedCategory);
            setFilteredProducts(filtered);
        }
    };

    // Handle category selection change
    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    // Handle search button click
    const handleSearchClick = () => {
        filterProducts();
    };

    // Handle add to cart
    const calculateCartTotal = (cartItems) => {
        return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2);
    };
    
    const addToCart = async (productId) => {
        console.log(`Adding product ID: ${productId} to cart`);
    
        try {
            const dataToSend = { product_id: productId, quantity: 1 };
            console.log('Data being sent to the server:', dataToSend);
    
            // Add product to cart
            const response = await axios.post('/api/cart/add', dataToSend);
            // console.log('Server response after adding product:', response.data);
    
            // Fetch updated cart contents
            const updatedCartResponse = await axios.get('/api/cart');
            const updatedCartItems = updatedCartResponse.data.cartItems || [];
            
            console.log('Updated cart items:', updatedCartItems);
    
            // Calculate and log the updated cart total
            const cartTotal = calculateCartTotal(updatedCartItems);
            console.log('Updated Cart Total:', cartTotal);
    
        } catch (error) {
            console.error('Error adding to cart:', error.response ? error.response.data : error.message);
        }
    };
    

    return (
        <div className="container product-list">
            <h1 className="product-list-title">Liste des Produits</h1>
            <div className="filter-container">
                <label htmlFor="category-select">Filtrer par catégorie:</label>
                <select id="category-select" value={selectedCategory} onChange={handleCategoryChange}>
                    <option value="">Toutes les catégories</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
                <button onClick={handleSearchClick}>Rechercher</button>
            </div>
            {filteredProducts.length > 0 ? (
                <div className="row product-list-grid">
                    {filteredProducts.map(product => (
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
