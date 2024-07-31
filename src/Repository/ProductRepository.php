<?php

namespace App\Repository;

use App\Entity\Product;
use App\Entity\Category;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Psr\Log\LoggerInterface; // Ajoutez ceci

/**
 * @extends ServiceEntityRepository<Product>
 */
class ProductRepository extends ServiceEntityRepository
{
    private $logger; // Ajoutez cette propriété

    public function __construct(ManagerRegistry $registry, LoggerInterface $logger)
    {
        parent::__construct($registry, Product::class);
        $this->logger = $logger; // Initialisez le logger

    }

    public function findByCategory(Category $category): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.category = :category')
            ->setParameter('category', $category)
            ->orderBy('p.id', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function searchByTerm(string $term)
    {
        $queryBuilder = $this->createQueryBuilder('p')
            ->leftJoin('p.category', 'c')
            ->where('p.name LIKE :term OR p.description LIKE :term')
            ->setParameter('term', '%' . $term . '%');

        // Log la requête SQL
        $query = $queryBuilder->getQuery();
        $this->logger->info('Requête SQL générée:', ['query' => $query->getSQL()]);

        $result = $query->getResult();

        // Log le nombre de résultats
        $this->logger->info('Nombre de résultats de la recherche:', ['count' => count($result)]);

        return $result;
    }

}
