<?php 

// src/Controller/OAuthController.php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class OAuthController extends AbstractController
{
    private $clientRegistry;

    public function __construct(ClientRegistry $clientRegistry)
    {
        $this->clientRegistry = $clientRegistry;
    }

    /**
     * @Route("/connect-google", name="connect_google")
     */
    public function connectGoogle()
    {
        return $this->clientRegistry
            ->getClient('google')
            ->redirect();
    }

    /**
     * @Route("/connect-google/check", name="connect_google_check")
     */
    public function connectGoogleCheck(Request $request)
    {
        // This method is handled by the GoogleAuthenticator
        // You can add any custom logic if needed
        return $this->redirectToRoute('app_home');
    }
}
