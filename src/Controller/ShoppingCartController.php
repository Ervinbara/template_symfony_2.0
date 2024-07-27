<?php 

// src/Controller/ShoppingCartController.php

namespace App\Controller;

use App\Entity\Cart;
use App\Entity\CartItem;
use App\Repository\CartRepository;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ShoppingCartController extends AbstractController
{
    // Affichage du panier
    #[Route('/cart', name: 'cart_page')]
    public function cartPage(): Response
    {
        return $this->render('cart/index.html.twig');
    }


    #[Route('/api/cart', name: 'get_cart', methods: ['GET'])]
    public function getCart(CartRepository $cartRepository): Response
    {
        // Récupère l'utilisateur actuellement connecté
        $user = $this->getUser();
        
        // Trouve le panier de l'utilisateur courant à partir du repository de paniers
        $cart = $cartRepository->findOneBy(['user' => $user]);
    
        // Vérifie si le panier existe pour l'utilisateur courant
        if (!$cart) {
            // Si le panier n'est pas trouvé, enregistre une erreur et retourne une réponse JSON avec un code 404 Not Found
            error_log('Cart not found for user: ' . $user->getId());
            return $this->json(['error' => 'Cart not found'], 404);
        }
    
        // Initialisation du tableau pour stocker les données du panier formatées
        $data = [];
    
        // Parcourt tous les éléments du panier
        foreach ($cart->getCartItems() as $cartItem) {
            // Récupère les détails du produit associé à l'élément du panier
            $product = $cartItem->getProduct();
            
            // Ajoute les détails de l'élément du panier au tableau de données
            $data[] = [
                'id' => $cartItem->getId(),
                'quantity' => $cartItem->getQuantity(),
                'product' => [
                    'id' => $product ? $product->getId() : null, // ID du produit, ou null si le produit n'existe pas
                    'name' => $product ? $product->getName() : 'Unknown Product', // Nom du produit, ou 'Unknown Product' si le produit n'existe pas
                    'description' => $product ? $product->getDescription() : null, // Description du produit, ou null si le produit n'existe pas
                    'price' => $product ? $product->getPrice() : null, // Prix du produit, ou null si le produit n'existe pas
                ],
            ];
        }
    
        // Retourne une réponse JSON contenant les éléments du panier formatés, avec un code 200 OK
        return $this->json(['cartItems' => $data], 200);
    }
    

    #[Route('/api/cart/add', name: 'add_to_cart', methods: ['POST'])]
    public function addToCart(Request $request, ProductRepository $productRepository, EntityManagerInterface $entityManager, CartRepository $cartRepository): Response
    {
        // Récupère l'utilisateur actuellement connecté
        $user = $this->getUser();
        
        // Décode les données JSON envoyées dans la requête
        $data = json_decode($request->getContent(), true);
    
        // Vérifie que les données nécessaires (product_id et quantity) sont présentes dans la requête
        if (!isset($data['product_id']) || !isset($data['quantity'])) {
            return $this->json(['error' => 'Invalid input'], 400); // Retourne une erreur si les données sont invalides
        }
    
        $productId = $data['product_id'];
        $quantity = $data['quantity'];
    
        // Logs pour le débogage
        error_log('Received productId: ' . $productId);
        error_log('Received quantity: ' . $quantity);
    
        // Cherche le panier associé à l'utilisateur courant dans le repository de paniers
        $cart = $cartRepository->findOneBy(['user' => $user]);
    
        if (!$cart) {
            // Si le panier n'existe pas, crée un nouveau panier
            $cart = new Cart();
            $cart->setUser($user);
            $cart->setCreatedAt(new \DateTimeImmutable()); // Définit la date de création du panier
            $cart->setUpdatedAt(new \DateTimeImmutable()); // Définit la date de mise à jour du panier
            $entityManager->persist($cart); // Persiste le nouveau panier dans la base de données
        }
    
        // Cherche le produit dans le repository de produits
        $product = $productRepository->find($productId);
    
        if (!$product) {
            // Si le produit n'existe pas, retourne une erreur
            return $this->json(['error' => 'Product not found'], 404);
        }
    
        // Cherche si le produit est déjà dans le panier
        $cartItem = $cart->getCartItems()->filter(function ($item) use ($product) {
            return $item->getProduct() === $product;
        })->first();
    
        if ($cartItem) {
            // Si le produit est déjà dans le panier, met à jour la quantité
            $cartItem->setQuantity($cartItem->getQuantity() + $quantity);
        } else {
            // Si le produit n'est pas encore dans le panier, ajoute un nouvel élément
            $cartItem = new CartItem();
            $cartItem->setProduct($product); // Associe le produit à l'élément du panier
            $cartItem->setQuantity($quantity); // Définit la quantité
            $cartItem->setCart($cart); // Associe l'élément du panier au panier
            $cart->addCartItem($cartItem); // Ajoute l'élément du panier au panier
        }
    
        // Met à jour la date de mise à jour du panier
        $cart->setUpdatedAt(new \DateTimeImmutable());
        
        // Enregistre toutes les modifications dans la base de données
        $entityManager->flush();
    
        // Retourne une réponse JSON confirmant que le produit a été ajouté avec succès
        return $this->json(['message' => 'Product added to cart successfully'], 200);
    }
    

    #[Route('/api/cart/remove', name: 'remove_from_cart', methods: ['POST'])]
    public function removeFromCart(Request $request, EntityManagerInterface $entityManager, CartRepository $cartRepository): Response
    {
        // Récupère l'utilisateur actuellement connecté
        $user = $this->getUser();
        
        // Récupère les données envoyées dans la requête POST
        $data = json_decode($request->getContent(), true);
        
        // Vérifie si l'ID de l'élément du panier est présent dans les données
        if (!isset($data['cart_item_id'])) {
            // Si l'ID de l'élément du panier n'est pas fourni, retourne une erreur 400 Bad Request
            return $this->json(['error' => 'Cart item ID is required'], 400);
        }
        
        // Récupère l'ID de l'élément du panier à partir des données de la requête
        $cartItemId = $data['cart_item_id'];
        error_log("Attempting to remove cart item with ID: $cartItemId");
        
        // Trouve le panier de l'utilisateur courant
        $cart = $cartRepository->findOneBy(['user' => $user]);
        
        // Vérifie si le panier existe pour l'utilisateur courant
        if (!$cart) {
            // Si le panier n'est pas trouvé, retourne une erreur 404 Not Found
            return $this->json(['error' => 'Cart not found'], 404);
        }
        
        // Trouve l'élément du panier à supprimer en utilisant l'ID fourni
        $cartItem = $entityManager->getRepository(CartItem::class)->find($cartItemId);
        
        // Vérifie si l'élément du panier existe
        if (!$cartItem) {
            // Si l'élément du panier n'est pas trouvé, retourne une erreur 404 Not Found
            return $this->json(['error' => 'Cart item not found'], 404);
        }
        
        // Vérifie si l'élément du panier appartient bien au panier de l'utilisateur courant
        if ($cartItem->getCart()->getId() !== $cart->getId()) {
            // Si l'élément du panier n'appartient pas à ce panier, retourne une erreur 400 Bad Request
            return $this->json(['error' => 'Cart item does not belong to this cart'], 400);
        }
        
        // Supprime l'élément du panier de la base de données
        $entityManager->remove($cartItem);
        $entityManager->flush();
        
        // Retourne une réponse JSON avec un message de succès
        return $this->json(['message' => 'Cart item removed'], 200);
    }

    #[Route('/api/cart/update', name: 'update_cart_item', methods: ['POST'])]
    public function updateCartItem(Request $request, CartRepository $cartRepository, EntityManagerInterface $entityManager): Response
    {
        // Récupère l'utilisateur actuellement connecté
        $user = $this->getUser();
        
        // Récupère les données envoyées dans la requête POST
        $data = json_decode($request->getContent(), true);
        
        // Vérifie si les données nécessaires (ID de l'élément du panier et quantité) sont présentes
        if (!isset($data['cart_item_id']) || !isset($data['quantity'])) {
            // Si les données sont invalides ou manquantes, retourne une erreur 400 Bad Request
            return $this->json(['error' => 'Invalid data'], 400);
        }
        
        // Récupère l'ID de l'élément du panier et la quantité à mettre à jour
        $cartItemId = $data['cart_item_id'];
        $quantity = $data['quantity'];
        
        // Trouve le panier de l'utilisateur courant
        $cart = $cartRepository->findOneBy(['user' => $user]);
        
        // Vérifie si le panier existe pour l'utilisateur courant
        if (!$cart) {
            // Si le panier n'est pas trouvé, retourne une erreur 404 Not Found
            return $this->json(['error' => 'Cart not found'], 404);
        }
        
        // Trouve l'élément du panier à mettre à jour en utilisant l'ID fourni
        $cartItem = $entityManager->getRepository(CartItem::class)->find($cartItemId);
        
        // Vérifie si l'élément du panier existe et appartient bien au panier de l'utilisateur courant
        if (!$cartItem || $cartItem->getCart()->getId() !== $cart->getId()) {
            // Si l'élément du panier n'est pas trouvé ou n'appartient pas à ce panier, retourne une erreur 404 Not Found
            return $this->json(['error' => 'Cart item not found'], 404);
        }
        
        // Vérifie si la quantité est inférieure ou égale à 0
        if ($quantity <= 0) {
            // Si la quantité est 0 ou moins, supprime l'élément du panier
            $entityManager->remove($cartItem);
        } else {
            // Sinon, met à jour la quantité de l'élément du panier
            $cartItem->setQuantity($quantity);
            $entityManager->persist($cartItem);
        }
        
        // Applique les modifications dans la base de données
        $entityManager->flush();
        
        // Retourne une réponse JSON contenant le panier mis à jour
        return $this->json(['cartItems' => $this->formatCartItems($cart)], 200);
    }
    
    // Méthode privée pour formater les éléments du panier en vue de la réponse JSON
    private function formatCartItems(Cart $cart): array
    {
        $data = [];
        
        // Parcourt tous les éléments du panier
        foreach ($cart->getCartItems() as $cartItem) {
            $product = $cartItem->getProduct();
            
            // Formate chaque élément du panier avec ses détails
            $data[] = [
                'id' => $cartItem->getId(),
                'quantity' => $cartItem->getQuantity(),
                'product' => [
                    'id' => $product ? $product->getId() : null,
                    'name' => $product ? $product->getName() : 'Unknown Product',
                    'description' => $product ? $product->getDescription() : null,
                    'price' => $product ? $product->getPrice() : null,
                ],
            ];
        }
        
        // Retourne le tableau formaté des éléments du panier
        return $data;
    }
    
}
