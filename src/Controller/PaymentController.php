<?php 

// src/Controller/PaymentController.php

namespace App\Controller;

use Stripe\Stripe;
use Stripe\PaymentIntent;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class PaymentController extends AbstractController
{
    #[Route('/api/payment', name: 'process_payment', methods: ['POST'])]
    public function processPayment(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $paymentMethodId = $data['payment_method_id'];

        // Configurer Stripe
        Stripe::setApiKey('your-stripe-secret-key');

        try {
            $paymentIntent = PaymentIntent::create([
                'amount' => 1000, // Montant en centimes
                'currency' => 'eur',
                'payment_method' => $paymentMethodId,
                'confirm' => true,
            ]);

            return $this->json(['success' => true]);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }
}
