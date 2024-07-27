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
    #[Route('/checkout', name: 'checkoutRecap')]
    public function showCheckoutPage(): Response
    {
        return $this->render('checkout/index.html.twig');
    }

    #[Route('/api/checkout', name: 'checkout', methods: ['POST'])]
    public function checkout(Request $request, CartRepository $cartRepository, EntityManagerInterface $entityManager): Response
    {
        $user = $this->getUser();
        $cart = $cartRepository->findOneBy(['user' => $user]);
        if (!$cart) {
            return $this->json(['error' => 'Cart not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        // Ajoutez des logs pour inspecter les données reçues
        error_log('Received data: ' . print_r($data, true));

        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], 400);
        }

        $address = $data['address'] ?? null;
        $paymentMethod = $data['payment_method'] ?? null;

        if (!$address || !$paymentMethod) {
            return $this->json(['error' => 'Address and payment method are required'], 400);
        }

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

        try {
            $entityManager->flush();
        } catch (\Exception $e) {
            return $this->json(['error' => 'Error while saving data: ' . $e->getMessage()], 500);
        }

        return $this->json(['status' => 'Order placed successfully'], 201);
    }
}
