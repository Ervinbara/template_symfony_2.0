<?php

// src/Controller/SearchController.php

namespace App\Controller;

use Psr\Log\LoggerInterface;
use App\Repository\ProductRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class SearchController extends AbstractController
{
    private $productRepository;
    private $logger; // Ajoutez cette propriété

    public function __construct(ProductRepository $productRepository, LoggerInterface $logger) // Ajoutez le logger ici
    {
        $this->productRepository = $productRepository;
        $this->logger = $logger; // Initialisez le logger
    }

    #[Route('/search', name: 'search', methods: ['GET'])]
    public function search(Request $request): JsonResponse
    {
        try {
            $searchTerm = $request->query->get('query');
    
            // Log le terme de recherche
            $this->logger->info('Recherche effectuée avec le terme:', ['term' => $searchTerm]);
    
            if (!$searchTerm) {
                $this->logger->error('Aucun terme de recherche fourni.');
                return $this->json(['error' => 'Aucun terme de recherche fourni.'], 400);
            }
    
            $products = $this->productRepository->searchByTerm($searchTerm);
    
            // Log le nombre de produits trouvés
            $this->logger->info('Nombre de produits trouvés:', ['count' => count($products)]);
    
            return $this->json($products);
        } catch (\Exception $e) {
            // Log l'exception
            $this->logger->error('Erreur dans la recherche:', ['exception' => $e->getMessage()]);
    
            return $this->json(['error' => 'Erreur lors de la recherche'], 500);
        }
    }
}
