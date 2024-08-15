<?php

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
    private $logger;

    public function __construct(ProductRepository $productRepository, LoggerInterface $logger)
    {
        $this->productRepository = $productRepository;
        $this->logger = $logger;
    }

    #[Route('/search', name: 'search', methods: ['GET'])]
    public function search(Request $request)
    {
        $searchTerm = $request->query->get('query');
        $fromRedirect = $request->query->get('redirect', false);

        // Si la requête n'est pas AJAX, qu'il y a un terme de recherche, et que ce n'est pas une redirection, redirigez l'utilisateur
        if (!$request->isXmlHttpRequest() && $searchTerm && !$fromRedirect) {
            return $this->redirectToRoute('search', ['query' => $searchTerm, 'redirect' => true]);
        }

        try {
            // Log le terme de recherche
            $this->logger->info('Recherche effectuée avec le terme:', ['term' => $searchTerm]);

            if (!$searchTerm) {
                $this->logger->error('Aucun terme de recherche fourni.');
                return $this->json(['error' => 'Aucun terme de recherche fourni.'], 400);
            }

            $products = $this->productRepository->searchByTerm($searchTerm);

            // Log le nombre de produits trouvés
            $this->logger->info('Nombre de produits trouvés:', ['count' => count($products)]);

            // Si c'est une requête AJAX, retourner les résultats en JSON
            if ($request->isXmlHttpRequest()) {
                return $this->json($products);
            }

            // Sinon, rendre une page avec les résultats
            return $this->render('search/search.html.twig', [
                'products' => $products,
                'searchTerm' => $searchTerm,
            ]);
        } catch (\Exception $e) {
            // Log l'exception
            $this->logger->error('Erreur dans la recherche:', ['exception' => $e->getMessage()]);

            return $this->json(['error' => 'Erreur lors de la recherche'], 500);
        }
    }
}
