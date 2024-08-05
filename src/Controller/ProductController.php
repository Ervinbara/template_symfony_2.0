<?php

// src/Controller/ProductController.php

namespace App\Controller;

use App\Repository\ProductRepository;
use App\Repository\CategoryRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Psr\Log\LoggerInterface;


#[Route('/product')]
class ProductController extends AbstractController
{
    private $productRepository;
    private $categoryRepository;
    private $logger;


    public function __construct(ProductRepository $productRepository, CategoryRepository $categoryRepository, LoggerInterface $logger)
    {
        $this->productRepository = $productRepository;
        $this->categoryRepository = $categoryRepository;
        $this->logger = $logger;
    }

    #[Route('/', name: 'product_index', methods: ['GET'])]
    public function index(): Response
    {

        // Récupérer tous les produits depuis la base de données
        // $products = $this->productRepository->findAll();

        return $this->render('product/index.html.twig', [
            // 'products' => $products,
        ]);
 
    }

    #[Route('/{id}', name: 'product_show', methods: ['GET'])]
    public function show($id): Response
    {
        try {
            $product = $this->productRepository->find($id);

            if (!$product) {
                throw $this->createNotFoundException('Product not found');
            }

            return $this->render('product/show.html.twig', [
                'product' => $product,
            ]);
        } catch (\Exception $e) {
            return new Response('Error: ' . $e->getMessage());
        }
    }

    // #[Route('/json', name: 'product_json', methods: ['GET'])]
    // public function getProductsJson(): JsonResponse
    // {
    //     try {
    //         // Récupérer les 8 derniers produits
    //         $products = $this->productRepository->findAll();

    //         if (empty($products)) {
    //             // Log et retourner une réponse vide si aucun produit n'est trouvé
    //             $this->logger->info('No products found');
    //             return new JsonResponse([], JsonResponse::HTTP_OK);
    //         }

    //         $data = [];

    //         foreach ($products as $product) {
    //             $data[] = [
    //                 'id' => $product->getId(),
    //                 'name' => $product->getName(),
    //                 'description' => $product->getDescription(),
    //                 'price' => $product->getPrice(),
    //                 'stock' => $product->getStock(),
    //                 'createdAt' => $product->getCreatedAt()?->format('c'),
    //                 'updatedAt' => $product->getUpdatedAt()?->format('c'),
    //             ];
    //         }

    //         return new JsonResponse($data);
    //     } catch (\Exception $e) {
    //         $this->logger->error('Error fetching products: ' . $e->getMessage());
    //         return new JsonResponse(['error' => 'Error fetching products'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
    //     }
    // }
}
