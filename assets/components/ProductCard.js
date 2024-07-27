import React from 'react';
import '../styles/ProductCard.css'; // Import des styles

const ProductCard = ({ product, addToCart }) => {
    return (
        <div className="card product-card">
            <img src={product.image} alt={product.name} className="card-img-top product-card-image" />
            <div className="card-body product-card-body">
                <h5 className="card-title product-card-title">{product.name}</h5>
                <p className="card-text product-card-description">{product.description}</p>
                <p className="card-text product-card-price">Prix: {product.price} €</p>
                <a href={`/product/${product.id}`} className="btn btn-primary">Voir plus</a>
                <button onClick={() => { 
                    console.log(`Adding product ID: ${product.id} to cart`); 
                    addToCart(product.id); 
                }} className="btn btn-secondary">Ajouter au Panier</button>
            </div>
        </div>
    );
};

export default ProductCard;
