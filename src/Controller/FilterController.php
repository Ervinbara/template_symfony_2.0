<?php

// src/Controller/FilterController.php

namespace App\Controller;

use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

#[Route('/api')]
class FilterController extends AbstractController
{
    private $productRepository;

    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    #[Route('/clothing-types', name: 'api_clothing_types', methods: ['GET'])]
    public function getClothingTypes(): JsonResponse
    {
        $clothingTypes = $this->productRepository->findDistinctClothingTypes();

        return $this->json($clothingTypes);
    }

    #[Route('/genders', name: 'api_genders', methods: ['GET'])]
    public function getGenders(): JsonResponse
    {
        // Vous devez définir cette méthode pour retourner les genres depuis la base de données.
        $genders = ['male', 'female']; // Remplacez cela par la récupération réelle depuis la base de données.
        return $this->json($genders);
    }
}
