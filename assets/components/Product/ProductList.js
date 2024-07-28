import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard'; // Import du composant ProductCard pour afficher les produits
import '../styles/ProductList.css'; // Import des styles pour la liste de produits
import axios from 'axios'; // Import d'axios pour les requêtes HTTP

const ProductList = () => {
    // Déclaration d'un état local pour stocker les produits
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Fonction pour charger les produits depuis le backend Symfony
        const fetchProducts = async () => {
            try {
                // Requête GET pour récupérer la liste des produits
                const response = await fetch('/api/products');
                const data = await response.json();
                console.log('Fetched products:', data);
                
                // Mise à jour de l'état local avec les produits récupérés
                setProducts(data['hydra:member']);
            } catch (error) {
                // Gestion des erreurs de la requête
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []); // Le tableau vide [] signifie que cet effet s'exécute une seule fois, lors du montage du composant

    // Fonction pour ajouter un produit au panier
    const addToCart = (productId) => {
        console.log(`Adding product ID: ${productId} to cart`);
        
        // Requête POST pour ajouter le produit au panier
        axios.post('/api/cart/add', { product_id: productId, quantity: 1 })
            .then(response => {
                console.log('Product added to cart:', response.data);
            })
            .catch(error => {
                // Gestion des erreurs de la requête
                console.error('Error adding to cart:', error);
            });
    };

    return (
        <div className="container product-list">
            <h1 className="product-list-title">Liste des Produits</h1>
            {products.length > 0 ? (
                // Affichage des produits s'ils existent
                <div className="row product-list-grid">
                    {products.map(product => (
                        <div className="col-md-4" key={product.id}>
                            {/* Utilisation du composant ProductCard pour chaque produit */}
                            <ProductCard product={product} addToCart={addToCart} />
                        </div>
                    ))}
                </div>
            ) : (
                // Message affiché s'il n'y a pas de produits
                <p>Aucun produit trouvé.</p>
            )}
        </div>
    );
};

export default ProductList;
