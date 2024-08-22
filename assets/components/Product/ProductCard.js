import React, { useContext } from 'react';
import LazyLoad from 'react-lazyload';
import { Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';  // Importer le contexte du panier
import '../../styles/SiteElements/ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);  // Récupérer la fonction addToCart

    const handleAddToCart = () => {
        addToCart(product.id);  // Ajouter le produit au panier en passant l'ID du produit
        alert('Produit ajouté au panier !');
    };

    return (
        <div className="product-card">
            <LazyLoad height={200} offset={100}>
                <img src={product.image} alt={product.name} />
            </LazyLoad>
            <div className="product-card-body">
                <h5 className="product-card-title">{product.name}</h5>
                <p className="product-card-price">{product.price} €</p>
                <p className="product-card-colors">{product.colors ? `${product.colors} couleurs` : '1 couleur'}</p>
                <div className="product-card-buttons">
                    <button className="btn btn-add-to-cart" onClick={handleAddToCart}>Ajout rapide</button>
                    <Link to={`/product/${product.id}`} className="btn btn-view-more">Voir plus</Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
