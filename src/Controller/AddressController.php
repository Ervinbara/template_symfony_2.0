<?php

// src/Controller/AddressController.php

namespace App\Controller;

use App\Repository\AddressRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class AddressController extends AbstractController
{
    #[Route('/api/user/addresses', name: 'user_addresses', methods: ['GET'])]
    public function getUserAddresses(TokenStorageInterface $tokenStorage, AddressRepository $addressRepository): JsonResponse
    {
        $token = $tokenStorage->getToken();
        if (!$token) {
            return new JsonResponse(['error' => 'No authentication token found'], 401);
        }

        $user = $token->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'User not authenticated'], 401);
        }

        // Récupérer les adresses de l'utilisateur connecté
        $addresses = $addressRepository->findBy(['user' => $user]);

        // Convertir les adresses en un tableau associatif
        $addressData = array_map(function($address) {
            return [
                'id' => $address->getId(),
                'street' => $address->getStreet(),
                'city' => $address->getCity(),
                'state' => $address->getState(),
                'zipcode' => $address->getZipcode(),
                'country' => $address->getCountry(),
            ];
        }, $addresses);

        return new JsonResponse($addressData);
    }
}
