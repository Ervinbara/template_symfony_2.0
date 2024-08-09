<?php

namespace App\Controller;

use App\Entity\Banner;
use App\Entity\EndBanner;
use App\Entity\SecondarySlider;
use App\Entity\ThirdSlider;
use App\Entity\FourthSlider;
use App\Entity\FifthSlider;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class BannerController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private ProductRepository $productRepository;

    public function __construct(EntityManagerInterface $entityManager, ProductRepository $productRepository)
    {
        $this->entityManager = $entityManager;
        $this->productRepository = $productRepository;
    }

    #[Route('/api/banners', name: 'api_banners', methods: ['GET'])]
    public function getBanners(): Response
    {
        $banners = $this->entityManager->getRepository(Banner::class)->findAll();

        $bannerData = array_map(function ($banner) {
            return [
                'type' => $banner->getType(),
                'src' => $banner->getSrc(),
                'altText' => $banner->getAltText(),
            ];
        }, $banners);

        return $this->json($bannerData);
    }

    #[Route('/api/end-banners', name: 'api_end_banners', methods: ['GET'])]
    public function getEndBanners(): Response
    {
        $banners = $this->entityManager->getRepository(EndBanner::class)->findAll();

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
    public function getSecondarySliders(): Response
    {
        $sliders = $this->entityManager->getRepository(SecondarySlider::class)->findAll();

        $sliderData = array_map(function ($slider) {
            return [
                'src' => $slider->getSrc(),
                'altText' => $slider->getAltText(),
                'caption' => $slider->getCaption(),
            ];
        }, $sliders);

        return $this->json($sliderData);
    }

    #[Route('/api/third-sliders', name: 'api_third_sliders', methods: ['GET'])]
    public function getThirdSliders(): Response
    {
        $sliders = $this->entityManager->getRepository(ThirdSlider::class)->findAll();

        $sliderData = array_map(function ($slider) {
            return [
                'src' => $slider->getSrc(),
                'altText' => $slider->getAltText(),
                'caption' => $slider->getCaption(),
            ];
        }, $sliders);

        return $this->json($sliderData);
    }

    #[Route('/api/fourth-sliders', name: 'api_fourth_sliders', methods: ['GET'])]
    public function getFourthSliders(): Response
    {
        $sliders = $this->entityManager->getRepository(FourthSlider::class)->findAll();

        $sliderData = array_map(function ($slider) {
            return [
                'src' => $slider->getSrc(),
                'altText' => $slider->getAltText(),
                'caption' => $slider->getCaption(),
            ];
        }, $sliders);

        return $this->json($sliderData);
    }

    #[Route('/api/fifth-sliders', name: 'api_fifth_sliders', methods: ['GET'])]
    public function getFifthSliders(): Response
    {
        $sliders = $this->entityManager->getRepository(FifthSlider::class)->findAll();

        $sliderData = array_map(function ($slider) {
            return [
                'src' => $slider->getSrc(),
                'altText' => $slider->getAltText(),
                'caption' => $slider->getCaption(),
            ];
        }, $sliders);

        return $this->json($sliderData);
    }

    #[Route('/api/sixth-sliders', name: 'api_sixth_sliders', methods: ['GET'])]
    public function getSixthSliders(): Response
    {
        $limit = 8;
        $sliders = $this->productRepository->findLatestProducts($limit);

        $sliderData = array_map(function ($slider) {
            return [
                'src' => $slider->getImage(),
                'altText' => $slider->getDescription(),
                'caption' => $slider->getName(),
            ];
        }, $sliders);

        return $this->json($sliderData);
    }
}
