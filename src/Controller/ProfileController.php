<?php

namespace App\Controller;

use App\Entity\Address;
use App\Entity\User;
use App\Form\AddressType;
use App\Form\UserProfileType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

class ProfileController extends AbstractController
{
    #[Route('/profile', name: 'profile_edit')]
    public function edit(Request $request, EntityManagerInterface $entityManager, Security $security): Response
    {
        $user = $security->getUser();
        $userForm = $this->createForm(UserProfileType::class, $user);
        $userForm->handleRequest($request);

        if ($userForm->isSubmitted() && $userForm->isValid()) {
            // Gestion du mot de passe
            $plainPassword = $userForm->get('password')->getData();
            if ($plainPassword) {
                $user->setPassword(password_hash($plainPassword, PASSWORD_BCRYPT));
            }

            $entityManager->flush();

            return $this->redirectToRoute('profile_edit');
        }

        $address = new Address();
        $addressForm = $this->createForm(AddressType::class, $address);
        $addressForm->handleRequest($request);

        if ($addressForm->isSubmitted() && $addressForm->isValid()) {
            $address->setUser($user);
            $entityManager->persist($address);
            $entityManager->flush();

            return $this->redirectToRoute('profile_edit');
        }

        return $this->render('profile/edit.html.twig', [
            'userForm' => $userForm->createView(),
            'addressForm' => $addressForm->createView(),
            'addresses' => $user->getAddresses(),
        ]);
    }

    #[Route('/profile/address/{id}/delete', name: 'profile_address_delete')]
    public function deleteAddress(Address $address, EntityManagerInterface $entityManager, Security $security): Response
    {
        $user = $security->getUser();
        if ($address->getUser() !== $user) {
            throw $this->createAccessDeniedException();
        }

        $entityManager->remove($address);
        $entityManager->flush();

        return $this->redirectToRoute('profile_edit');
    }
}
