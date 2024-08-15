import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/SiteElements/ProductCard.css';

const ProductCard = ({ product, addToCart = () => {} }) => {
    const handleAddToCart = () => {
        console.log("Product ID in ProductCard:", product.id);
        addToCart(product.id);
    };

    return (
        <div className="card product-card">
            <img src={product.image} alt={product.name} className="card-img-top product-card-image" />
            <div className="card-body product-card-body">
                <h5 className="card-title product-card-title">{product.name}</h5>
                <p className="card-text product-card-price">Prix: {product.price} €</p>
                <div className="product-card-buttons">
                    <button onClick={handleAddToCart} className="btn btn-add-to-cart">
                        Ajout rapide
                    </button>
                    <Link to={`/product/${product.id}`} className="btn btn-view-more">
                        Voir
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
