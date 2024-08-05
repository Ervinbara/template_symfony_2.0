<?php

namespace App\Controller;

use App\Repository\ProductRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ProductLatestController extends AbstractController
{
    private $productRepository;

    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }
    #[Route('/api/test', name: 'test_route', methods: ['GET'])]
    public function testRoute(): JsonResponse
    {
        return new JsonResponse(['status' => 'ok']);
    }

    #[Route('/api/product/latest', name: 'product_latest', methods: ['GET'])]
    public function __invoke(): JsonResponse
    {
        // Définir la limite des produits les plus récents à récupérer
        $limit = 8; // ou une autre valeur selon vos besoins
    
        // Utiliser la méthode findLatestProducts pour récupérer les derniers produits
        $latestProducts = $this->productRepository->findLatestProducts($limit);
    
        $data = [];
    
        foreach ($latestProducts as $product) {
            $data[] = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'description' => $product->getDescription(),
                'price' => $product->getPrice(),
                'stock' => $product->getStock(),
                'createdAt' => $product->getCreatedAt() ? $product->getCreatedAt()->format('c') : null,
                'updatedAt' => $product->getUpdatedAt() ? $product->getUpdatedAt()->format('c') : null,
            ];
        }
    
        return new JsonResponse($data);
    }
}
