<?php

namespace App\Security;

use App\Entity\User;
use Psr\Log\LoggerInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\RouterInterface;
use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Util\TargetPathTrait;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use KnpU\OAuth2ClientBundle\Security\Authenticator\OAuth2Authenticator;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\CustomCredentials;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class GoogleAuthenticator extends OAuth2Authenticator
{
    use TargetPathTrait; // Permet de sauvegarder et de récupérer le chemin de redirection après l'authentification

    private $clientRegistry;
    private $entityManager;
    private $router;
    private $logger;
    private $tokenStorage;
    private $security;
    private $passwordHasher;

    // Constructeur pour injecter les dépendances nécessaires
    public function __construct(
        ClientRegistry $clientRegistry, 
        EntityManagerInterface $entityManager, 
        RouterInterface $router, 
        LoggerInterface $logger, 
        TokenStorageInterface $tokenStorage, 
        Security $security, 
        UserPasswordHasherInterface $passwordHasher
    ) {
        $this->clientRegistry = $clientRegistry;
        $this->entityManager = $entityManager;
        $this->router = $router;
        $this->logger = $logger;
        $this->tokenStorage = $tokenStorage;
        $this->security = $security;
        $this->passwordHasher = $passwordHasher;
    }

    // Vérifie si la requête actuelle peut être traitée par cet authentificateur
    public function supports(Request $request): ?bool
    {
        return $request->getPathInfo() === '/connect-google/check' && $request->isMethod('GET');
    }

    // Fonction d'authentification avec Google
    public function authenticate(Request $request): Passport
    {
        $this->logger->info('Starting authentication with Google');

        try {
            // Récupère le token d'accès depuis Google
            $accessToken = $this->fetchAccessToken($this->getGoogleClient());
            $this->logger->info('Fetched access token from Google', ['token' => $accessToken->getToken()]);

            // Récupère les informations de l'utilisateur à partir du token d'accès
            $googleUser = $this->getGoogleClient()->fetchUserFromToken($accessToken);
            $this->logger->info('Fetched Google user', ['user' => $googleUser]);

            // Récupère les informations nécessaires de l'utilisateur Google
            $email = $googleUser->getEmail();
            $firstName = $googleUser->getFirstName() ?? ''; // Utilise une chaîne vide si firstName est null
            $lastName = $googleUser->getLastName() ?? '';  

            // Cherche l'utilisateur dans la base de données
            $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

            if (!$user) {
                // Si l'utilisateur n'existe pas, crée un nouvel utilisateur
                $user = new User();
                $user->setEmail($googleUser->getEmail());
                $user->setGoogleId($googleUser->getId());
                $user->setFirstName($firstName);
                $user->setLastName($lastName);
                $hashedPassword = $this->passwordHasher->hashPassword($user, 'default_password'); // Remplacez 'default_password' par une valeur sécurisée
                $user->setPassword($hashedPassword);
                $this->entityManager->persist($user);
                $this->entityManager->flush();
            }

            // Crée un token d'authentification pour l'utilisateur
            $token = new UsernamePasswordToken($user, 'main', $user->getRoles());

            // Stocke le token dans le stockage de tokens et la session
            $this->tokenStorage->setToken($token);
            $request->getSession()->set('_security_main', serialize($token));

            // Crée et retourne un Passport pour l'authentification
            return new Passport(
                new UserBadge($email),
                new CustomCredentials(
                    function($credentials, UserInterface $user) {
                        return true; // Les credentials sont toujours valides ici
                    },
                    $accessToken->getToken()
                )
            );
        } catch (\Exception $e) {
            // Log l'erreur d'authentification et lance une exception
            $this->logger->error('Authentication failed', ['error' => $e->getMessage()]);
            throw new CustomUserMessageAuthenticationException('Authentication failed.');
        }
    }

    // Gère la réussite de l'authentification
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        $this->logger->info('Authentication successful');

        // Redirige vers la page cible ou vers la page d'accueil
        if ($targetPath = $this->getTargetPath($request->getSession(), $firewallName)) {
            return new RedirectResponse($targetPath);
        }

        return new RedirectResponse($this->router->generate('app_home'));
    }

    // Gère l'échec de l'authentification
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): Response
    {
        $this->logger->error('Authentication failed', ['exception' => $exception]);

        // Stocke l'erreur d'authentification dans la session
        $request->getSession()->set(Security::AUTHENTICATION_ERROR, $exception);

        // Redirige vers la page de connexion
        return new RedirectResponse($this->router->generate('app_login'));
    }

    // Récupère le client Google à partir du registre de clients
    private function getGoogleClient()
    {
        return $this->clientRegistry->getClient('google');
    }
}
