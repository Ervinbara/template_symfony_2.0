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

    return (
        <div className="container product-list">
            <h1 className="product-list-title">Vêtements Nike pour homme (2327)</h1>
            <div className="product-list-content">
                {/* Sidebar des filtres */}
                <div className="filter-container">
                    <div className="filter-section">
                        <h3 className="filter-title">Catégories</h3>
                        <select id="category-select" value={selectedCategory} onChange={handleCategoryChange}>
                            <option value="">Toutes les catégories</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                        <button onClick={handleSearchClick}>Rechercher</button>
                    </div>

                    <div className="filter-section">
                        <h3 className="filter-title">Rechercher par prix</h3>
                        <input type="range" min="0" max="300" />
                    </div>
                </div>

                {/* Grille de produits */}
                <div className="product-list-grid">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
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
