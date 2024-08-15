<?php

// src/Controller/ProfileApiController.php

namespace App\Controller;

use App\Entity\Address;
use App\Entity\User;
use App\Form\AddressType;
use App\Form\UserProfileType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

class ProfileController extends AbstractController
{
    #[Route('/profile', name: 'api_profile_get', methods: ['GET'])]
    public function getProfile(Security $security): JsonResponse
    {
        $user = $security->getUser();

        return new JsonResponse([
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'email' => $user->getEmail(),
            'addresses' => array_map(function (Address $address) {
                return [
                    'id' => $address->getId(),
                    'street' => $address->getStreet(),
                    'city' => $address->getCity(),
                    'state' => $address->getState(),
                    'zipcode' => $address->getZipcode(),
                    'country' => $address->getCountry(),
                ];
            }, $user->getAddresses()->toArray()),
        ]);
    }

    #[Route('/profile', name: 'api_profile_update', methods: ['PUT'])]
    public function updateProfile(Request $request, Security $security, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $security->getUser();
        $data = json_decode($request->getContent(), true);

        $user->setFirstName($data['firstName'] ?? $user->getFirstName());
        $user->setLastName($data['lastName'] ?? $user->getLastName());
        $user->setEmail($data['email'] ?? $user->getEmail());

        if (!empty($data['password'])) {
            $user->setPassword(password_hash($data['password'], PASSWORD_BCRYPT));
        }

        $entityManager->flush();

        return new JsonResponse(['status' => 'Profile updated']);
    }

    #[Route('/profile/address', name: 'api_profile_address_add', methods: ['POST'])]
    public function addAddress(Request $request, Security $security, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $security->getUser();
        $data = json_decode($request->getContent(), true);

        $address = new Address();
        $address->setStreet($data['street']);
        $address->setCity($data['city']);
        $address->setState($data['state']);
        $address->setZipcode($data['zipcode']);
        $address->setCountry($data['country']);
        $address->setUser($user);

        $entityManager->persist($address);
        $entityManager->flush();

        return new JsonResponse(['status' => 'Address added']);
    }

    #[Route('/profile/address/{id}', name: 'api_profile_address_delete', methods: ['DELETE'])]
    public function deleteAddress(Address $address, Security $security, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $security->getUser();
        if ($address->getUser() !== $user) {
            throw $this->createAccessDeniedException();
        }

        $entityManager->remove($address);
        $entityManager->flush();

        return new JsonResponse(['status' => 'Address deleted']);
    }
}
