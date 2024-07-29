<?php

namespace App\Controller;

use App\Entity\Banner;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class BannerController extends AbstractController
{
    #[Route('/api/banners', name: 'api_banners', methods: ['GET'])]
    public function getBanners(EntityManagerInterface $entityManager): Response
    {
        $banners = $entityManager->getRepository(Banner::class)->findAll();

        $bannerData = array_map(function ($banner) {
            return [
                'type' => $banner->getType(),
                'src' => $banner->getSrc(),
                'altText' => $banner->getAltText(),
            ];
        }, $banners);

        return $this->json($bannerData);
    }
}
