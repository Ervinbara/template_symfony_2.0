<?php

// src/Controller/AuthController.php

namespace App\Controller;

use App\Entity\User;
use App\Form\UserType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AuthController extends AbstractController
{
    #[Route('/register', name: 'app_register', methods: ['POST', 'GET'])]
    public function register(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher): Response
    {
        if ($request->isMethod('GET')) {
            // Retourner le formulaire d'inscription ou la page avec l'application React
            return $this->render('auth/register.html.twig');
        }

        if ($request->isMethod('POST')) {
            $data = json_decode($request->getContent(), true);

            if (!$data) {
                return new JsonResponse(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
            }

            if ($data['password'] !== $data['confirmPassword']) {
                return new JsonResponse(['error' => 'Passwords do not match'], Response::HTTP_BAD_REQUEST);
            }

            $user = new User();
            $user->setEmail($data['email']);
            $user->setPassword($passwordHasher->hashPassword($user, $data['password']));
            $user->setCreatedAt(new \DateTimeImmutable());

            $entityManager->persist($user);
            $entityManager->flush();

            return new JsonResponse(['status' => 'User created'], Response::HTTP_CREATED);
        }

        return new JsonResponse(['error' => 'Invalid request method'], Response::HTTP_METHOD_NOT_ALLOWED);
    }

    #[Route('/login', name: 'app_login')]
    public function login(Security $security): Response
    {
        // Vérifiez si l'utilisateur est déjà connecté
        if ($security->isGranted('IS_AUTHENTICATED_FULLY')) {
            // Redirigez vers la page d'accueil
            return $this->redirectToRoute('app_home');
        }

        // Rendu du formulaire de connexion
        return $this->render('auth/login.html.twig');
    }

    #[Route('/logout', name: 'app_logout')]
    public function logout()
    {
        // Symfony will handle the logout process
    }

    #[Route('/api/check-auth', name: 'api_check_auth', methods: ['GET'])]
    public function checkAuth(): JsonResponse
    {
        return new JsonResponse([
            'isAuthenticated' => $this->getUser() !== null,
        ]);
    }
}
