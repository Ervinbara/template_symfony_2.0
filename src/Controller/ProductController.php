<?php

// src/Controller/ProductController.php

namespace App\Controller;

use App\Entity\Product;
use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/product')]
class ProductController extends AbstractController
{
    private $productRepository;

    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
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
            // Récupérer un produit spécifique depuis la base de données
            $product = $this->productRepository->find($id);

            if (!$product) {
                throw $this->createNotFoundException('Product not found');
            }

            return $this->render('product/show.html.twig', [
                'product' => $product,
            ]);
        } catch (\Exception $e) {
            // Log the error or handle it as needed
            return new Response('Error: ' . $e->getMessage());
        }
    }
}
