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
    #[Route('/cart', name: 'cart_page')]
    public function cartPage(): Response
    {
        return $this->render('cart/index.html.twig');
    }

    #[Route('/api/cart', name: 'get_cart', methods: ['GET'])]
    public function getCart(CartRepository $cartRepository): Response
    {
        $user = $this->getUser();
        $cart = $cartRepository->findOneBy(['user' => $user]);

        if (!$cart) {
            error_log('Cart not found for user: ' . $user->getId());
            return $this->json(['error' => 'Cart not found'], 404);
        }

        $data = [];
        foreach ($cart->getCartItems() as $cartItem) {
            $product = $cartItem->getProduct();
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

        return $this->json(['cartItems' => $data], 200);
    }

    #[Route('/api/cart/add', name: 'add_to_cart', methods: ['POST'])]
    public function addToCart(Request $request, ProductRepository $productRepository, EntityManagerInterface $entityManager, CartRepository $cartRepository): Response
    {
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        if (!isset($data['product_id']) || !isset($data['quantity'])) {
            return $this->json(['error' => 'Invalid input'], 400);
        }

        $productId = $data['product_id'];
        $quantity = $data['quantity'];

        // Debug logs
        error_log('Received productId: ' . $productId);
        error_log('Received quantity: ' . $quantity);

        // Trouvez ou créez le panier pour l'utilisateur
        $cart = $cartRepository->findOneBy(['user' => $user]);
        if (!$cart) {
            $cart = new Cart();
            $cart->setUser($user);
            $cart->setCreatedAt(new \DateTimeImmutable());
            $cart->setUpdatedAt(new \DateTimeImmutable());
            $entityManager->persist($cart);
        }

        // Trouvez le produit
        $product = $productRepository->find($productId);
        if (!$product) {
            return $this->json(['error' => 'Product not found'], 404);
        }

        // Trouvez ou créez l'élément du panier
        $cartItem = $cart->getCartItems()->filter(function ($item) use ($product) {
            return $item->getProduct() === $product;
        })->first();

        if ($cartItem) {
            // Produit déjà dans le panier, mettez à jour la quantité
            $cartItem->setQuantity($cartItem->getQuantity() + $quantity);
        } else {
            // Produit pas encore dans le panier, ajoutez un nouvel élément
            $cartItem = new CartItem();
            $cartItem->setProduct($product);
            $cartItem->setQuantity($quantity);
            $cartItem->setCart($cart);
            $cart->addCartItem($cartItem);
        }

        $cart->setUpdatedAt(new \DateTimeImmutable());
        $entityManager->flush();

        return $this->json(['message' => 'Product added to cart successfully'], 200);
    }

    #[Route('/api/cart/remove', name: 'remove_from_cart', methods: ['POST'])]
    public function removeFromCart(Request $request, EntityManagerInterface $entityManager, CartRepository $cartRepository): Response
    {
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['cart_item_id'])) {
            return $this->json(['error' => 'Cart item ID is required'], 400);
        }
        
        $cartItemId = $data['cart_item_id'];
        error_log("Attempting to remove cart item with ID: $cartItemId");
    
        $cart = $cartRepository->findOneBy(['user' => $user]);
        
        if (!$cart) {
            return $this->json(['error' => 'Cart not found'], 404);
        }
        
        $cartItem = $entityManager->getRepository(CartItem::class)->find($cartItemId);
        
        if (!$cartItem) {
            return $this->json(['error' => 'Cart item not found'], 404);
        }
    
        if ($cartItem->getCart()->getId() !== $cart->getId()) {
            return $this->json(['error' => 'Cart item does not belong to this cart'], 400);
        }
        
        $entityManager->remove($cartItem);
        $entityManager->flush();
        
        return $this->json(['message' => 'Cart item removed'], 200);
    }

    #[Route('/api/cart/update', name: 'update_cart_item', methods: ['POST'])]
    public function updateCartItem(Request $request, CartRepository $cartRepository, EntityManagerInterface $entityManager): Response
    {
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);
    
        if (!isset($data['cart_item_id']) || !isset($data['quantity'])) {
            return $this->json(['error' => 'Invalid data'], 400);
        }
    
        $cartItemId = $data['cart_item_id'];
        $quantity = $data['quantity'];
    
        $cart = $cartRepository->findOneBy(['user' => $user]);
    
        if (!$cart) {
            return $this->json(['error' => 'Cart not found'], 404);
        }
    
        $cartItem = $entityManager->getRepository(CartItem::class)->find($cartItemId);
    
        if (!$cartItem || $cartItem->getCart()->getId() !== $cart->getId()) {
            return $this->json(['error' => 'Cart item not found'], 404);
        }
    
        if ($quantity <= 0) {
            $entityManager->remove($cartItem);
        } else {
            $cartItem->setQuantity($quantity);
            $entityManager->persist($cartItem);
        }
    
        $entityManager->flush();
    
        // Renvoie le panier mis à jour
        return $this->json(['cartItems' => $this->formatCartItems($cart)], 200);
    }
    
    private function formatCartItems(Cart $cart): array
    {
        $data = [];
        foreach ($cart->getCartItems() as $cartItem) {
            $product = $cartItem->getProduct();
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
        return $data;
    }
    
}
