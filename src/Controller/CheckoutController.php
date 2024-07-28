<?php 


// src/Controller/CheckoutController.php

namespace App\Controller;

use Stripe\Stripe;
use App\Entity\Order;
use App\Entity\Address;
use App\Entity\Payment;
use App\Entity\OrderItem;
use Stripe\PaymentIntent;
use App\Repository\CartRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class CheckoutController extends AbstractController
{
    #[Route('/checkout', name: 'checkoutRecap')]
    public function showCheckoutPage(): Response
    {
        return $this->render('checkout/index.html.twig');
    }

    #[Route('/api/checkout', name: 'checkout', methods: ['POST'])]
    public function checkout(Request $request, CartRepository $cartRepository, EntityManagerInterface $entityManager, UrlGeneratorInterface $urlGenerator): Response
    {
        $user = $this->getUser();
        $cart = $cartRepository->findOneBy(['user' => $user]);
        if (!$cart) {
            return $this->json(['error' => 'Cart not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], 400);
        }

        $addressData = $data['address'] ?? null;
        $paymentMethod = $data['payment_method_id'] ?? null;

        if (!$addressData || !$paymentMethod) {
            return $this->json(['error' => 'Address and payment method are required'], 400);
        }

        // Log data to check its structure
        error_log(print_r($data, true));

        $address = null;
        if (is_array($addressData)) {
            $address = new Address();
            $address->setUser($user);
            $address->setStreet($addressData['street'] ?? null);
            $address->setCity($addressData['city'] ?? null);
            $address->setState($addressData['state'] ?? null);
            $address->setZipcode($addressData['zipcode'] ?? null);
            $address->setCountry($addressData['country'] ?? null);
            $entityManager->persist($address);
        } else {
            $address = $entityManager->getRepository(Address::class)->find($addressData);
            if (!$address || $address->getUser() !== $user) {
                return $this->json(['error' => 'Invalid address'], 400);
            }
        }

        Stripe::setApiKey('sk_test_51PhTvTKuzPUvarsTjwFSUwb5ijl1wkEKMSGpuRXYfQ5KMM70PlGbaVVtar3fQBqDtaRWgWfvdBOl0nIhHzT2xtQt00kio3Virt');

        try {
            $paymentIntent = PaymentIntent::create([
                'amount' => array_reduce($cart->getCartItems()->toArray(), fn($sum, $item) => $sum + $item->getProduct()->getPrice() * $item->getQuantity(), 0) * 100,
                'currency' => 'eur',
                'payment_method' => $paymentMethod,
                'confirmation_method' => 'manual',
                'confirm' => true,
                'return_url' => $urlGenerator->generate('product_index', [], UrlGeneratorInterface::ABSOLUTE_URL), // Ajout de la return_url complète
            ]);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Payment error: ' . $e->getMessage()], 400);
        }

        $order = new Order();
        $order->setUser($user);
        $order->setTotalPrice(array_reduce($cart->getCartItems()->toArray(), fn($sum, $item) => $sum + $item->getProduct()->getPrice() * $item->getQuantity(), 0));
        $order->setStatus('Pending');
        $order->setCreatedAt(new \DateTimeImmutable());
        $order->setShippingAddress($address);

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
        $payment->setStatus('Paid');
        $payment->setCreatedAt(new \DateTimeImmutable());

        $entityManager->persist($payment);

        try {
            $entityManager->flush();
        } catch (\Exception $e) {
            return $this->json(['error' => 'Error while saving data: ' . $e->getMessage()], 500);
        }

        foreach ($cart->getCartItems() as $cartItem) {
            $entityManager->remove($cartItem);
        }
        $entityManager->flush();

        return $this->json(['success' => true, 'message' => 'Order placed successfully'], 201);
    }
}
