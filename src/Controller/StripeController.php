<?php

// src/Controller/StripeController.php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class StripeController extends AbstractController
{
    #[Route('/api/stripe/public-key', name: 'stripe_public_key', methods: ['GET'])]
    public function getPublicKey(): JsonResponse
    {
        return new JsonResponse(['publicKey' => $_ENV['REACT_APP_STRIPE_PUBLIC_KEY']]);
    }
}
