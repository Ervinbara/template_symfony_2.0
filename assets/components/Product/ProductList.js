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
                const response = await fetch('/api/categories');
                const data = await response.json();
                console.log('Fetched categories:', data);
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
                const response = await fetch('/api/products');
                const data = await response.json();
                console.log('Fetched products:', data);
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
        console.log('Selected Category:', selectedCategory);
        console.log('All Products:', products);

        if (selectedCategory === '') {
            setFilteredProducts(products); // Show all products if no category selected
        } else {
            const filtered = products.filter(product => {
                console.log('Product Category ID:', product.category.id);
                return product.category.id.toString() === selectedCategory;
            });
            console.log('Filtered products:', filtered);
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

    const addToCart = (productId) => {
        console.log(`Adding product ID: ${productId} to cart`);

        axios.post('/api/cart/add', { product_id: productId, quantity: 1 })
            .then(response => {
                console.log('Product added to cart:', response.data);
            })
            .catch(error => {
                console.error('Error adding to cart:', error);
            });
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
