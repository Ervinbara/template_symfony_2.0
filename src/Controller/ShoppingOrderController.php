<?php 

// src/Controller/OrderController.php

namespace App\Controller;

use App\Entity\Order;
use App\Entity\OrderItem;
use App\Entity\Payment;
use App\Repository\CartRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ShoppingOrderController extends AbstractController
{
    #[Route('/api/order', name: 'create_order', methods: ['POST'])]
    public function createOrder(Request $request, CartRepository $cartRepository, EntityManagerInterface $entityManager): Response
    {
        $user = $this->getUser();
        $cart = $cartRepository->findOneBy(['user' => $user]);

        if (!$cart) {
            return $this->json(['error' => 'Cart not found'], 404);
        }

        $order = new Order();
        $order->setUser($user);
        $order->setStatus('Pending');
        $order->setCreatedAt(new \DateTimeImmutable());

        $totalPrice = 0;

        foreach ($cart->getCartItems() as $cartItem) {
            $orderItem = new OrderItem();
            $orderItem->setOrderId($order);
            $orderItem->setProduct($cartItem->getProduct());
            $orderItem->setQuantity($cartItem->getQuantity());
            $orderItem->setPrice($cartItem->getProduct()->getPrice());

            $entityManager->persist($orderItem);

            $totalPrice += $cartItem->getQuantity() * $cartItem->getProduct()->getPrice();
        }

        $order->setTotalPrice($totalPrice);
        $entityManager->persist($order);
        $entityManager->flush();

        return $this->json($order, 201, [], ['groups' => 'order:read']);
    }
}
