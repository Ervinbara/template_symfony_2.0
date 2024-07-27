import React from 'react';
import '../styles/ProductCard.css'; // Import des styles pour le composant ProductCard

// Composant ProductCard pour afficher les détails d'un produit
const ProductCard = ({ product, addToCart }) => {
    return (
        <div className="card product-card">
            {/* Affichage de l'image du produit */}
            <img src={product.image} alt={product.name} className="card-img-top product-card-image" />
            <div className="card-body product-card-body">
                {/* Titre du produit */}
                <h5 className="card-title product-card-title">{product.name}</h5>
                
                {/* Description du produit */}
                <p className="card-text product-card-description">{product.description}</p>
                
                {/* Prix du produit */}
                <p className="card-text product-card-price">Prix: {product.price} €</p>
                
                {/* Lien vers la page de détails du produit */}
                <a href={`/product/${product.id}`} className="btn btn-primary">Voir plus</a>
                
                {/* Bouton pour ajouter le produit au panier */}
                <button 
                    onClick={() => { 
                        // Log pour la débogage
                        console.log(`Adding product ID: ${product.id} to cart`); 
                        
                        // Appel de la fonction addToCart passée en props
                        addToCart(product.id); 
                    }} 
                    className="btn btn-secondary"
                >
                    Ajouter au Panier
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
