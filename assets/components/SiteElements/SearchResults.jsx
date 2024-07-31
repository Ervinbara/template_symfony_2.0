import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../Product/ProductCard';

const SearchResults = () => {
    const [products, setProducts] = useState([]); // Tableau vide par défaut
    const [filteredProducts, setFilteredProducts] = useState([]); // Tableau vide par défaut
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    // Logique en faisant une requête de recherche coté back
    //  useEffect(() => {
    //     const fetchProducts = async () => {
    //         try {
    //             const queryParams = new URLSearchParams(location.search);
    //             const query = queryParams.get('query');

    //             if (query) {
    //                 // Fetch filtered products from backend
    //                 const response = await axios.get(`/search?query=${query}`);
    //                 console.log('Données filtrées reçues:', response.data);
                    
    //                 // Extraire le tableau de produits
    //                 const productsData = response.data;
    //                 if (Array.isArray(productsData)) {
    //                     setFilteredProducts(productsData);
    //                 } else {
    //                     console.error('Les données extraites ne sont pas un tableau:', productsData);
    //                 }
    //             } else {
    //                 // Optionnel : si aucun terme de recherche, vous pouvez récupérer tous les produits ou un message
    //                 // const response = await axios.get('/api/products');
    //                 // const productsData = response.data['hydra:member'];
    //                 // setProducts(productsData);
    //                 // setFilteredProducts(productsData);
    //             }
    //         } catch (error) {
    //             console.error('Erreur lors de la récupération des produits:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchProducts();
    // }, [location.search]);

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products');
                console.log('Données des produits reçues:', response.data);
                
                // Extraire le tableau de produits
                const productsData = response.data['hydra:member'];
                if (Array.isArray(productsData)) {
                    setProducts(productsData);
                    setFilteredProducts(productsData); // Initial display
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
            if (Array.isArray(products)) {
                const filtered = products.filter(product =>
                    product.name.toLowerCase().includes(query.toLowerCase())
                );
                setFilteredProducts(filtered);
            } else {
                console.error('`products` n\'est pas un tableau:', products);
            }
        } else {
            setFilteredProducts(products);
        }
    }, [location.search, products]);

    return (
        <div className="container search-results">
            <h1>Résultats de recherche</h1>
            {loading ? (
                <p>Chargement...</p>
            ) : filteredProducts.length > 0 ? (
                <div className="row product-list-grid">
                    {filteredProducts.map(product => (
                        <div className="col-md-4" key={product.id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            ) : (
                <p>Aucun produit trouvé.</p>
            )}
        </div>
    );
};

export default SearchResults;
