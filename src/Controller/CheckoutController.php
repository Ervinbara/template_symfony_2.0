<?php

// src/Controller/CheckoutController.php

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

class CheckoutController extends AbstractController
{
    #[Route('/api/checkout', name: 'checkout', methods: ['POST'])]
    public function checkout(Request $request, CartRepository $cartRepository, EntityManagerInterface $entityManager): Response
    {
        $user = $this->getUser();
        $cart = $cartRepository->findOneBy(['user' => $user]);
        if (!$cart) {
            return $this->json(['error' => 'Cart not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        $paymentMethod = $data['payment_method'];

        $order = new Order();
        $order->setUser($user);
        $order->setTotalPrice(array_reduce($cart->getCartItems()->toArray(), fn($sum, $item) => $sum + $item->getProduct()->getPrice() * $item->getQuantity(), 0));
        $order->setStatus('Pending');
        $order->setCreatedAt(new \DateTimeImmutable());
        
        $entityManager->persist($order);

        foreach ($cart->getCartItems() as $cartItem) {
            $orderItem = new OrderItem();
            $orderItem->setOrderId($order);
            $orderItem->setProduct($cartItem->getProduct());
            $orderItem->setQuantity($cartItem->getQuantity());
            $orderItem->setPrice($cartItem->getProduct()->getPrice() * $cartItem->getQuantity());
            $entityManager->persist($orderItem);
        }

        $payment = new Payment();
        $payment->setPOrder($order);
        $payment->setAmount($order->getTotalPrice());
        $payment->setPaymentMethod($paymentMethod);
        $payment->setStatus('Pending');
        $payment->setCreatedAt(new \DateTimeImmutable());
        
        $entityManager->persist($payment);
        $entityManager->flush();

        return $this->json(['status' => 'Order placed successfully'], 201);
    }
}
