<?php

namespace App\Controller;

use App\Entity\Banner;
use App\Entity\SecondarySlider;
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

    #[Route('/api/secondary-sliders', name: 'api_secondary_sliders', methods: ['GET'])]
    public function getSecondarySliders(EntityManagerInterface $entityManager): Response
    {
        $sliders = $entityManager->getRepository(SecondarySlider::class)->findAll();

        $sliderData = array_map(function ($slider) {
            return [
                'src' => $slider->getSrc(),
                'altText' => $slider->getAltText(),
                'caption' => $slider->getCaption(),
            ];
        }, $sliders);

        return $this->json($sliderData);
    }
}
