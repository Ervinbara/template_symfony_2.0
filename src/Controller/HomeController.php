<?php

// src/Controller/HomeController.php

namespace App\Controller;

use App\Entity\Banner;
use App\Entity\EndBanner;
use App\Entity\FifthSlider;
use App\Entity\SixthSlider;
use App\Entity\ThirdSlider;
use App\Entity\FourthSlider;
use App\Entity\SecondarySlider;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class HomeController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private $productRepository;

    public function __construct(EntityManagerInterface $entityManager, ProductRepository $productRepository)
    {
        $this->entityManager = $entityManager;
        $this->productRepository = $productRepository;
    }
    
    #[Route('/{reactRouting}', name: 'app_home', requirements: ['reactRouting' => '.*'], defaults: ['reactRouting' => null])]
    public function index(): Response
    {
        // Pour le sixième slider (Latest products)
        $limit = 8;
        // Récupération des données des bannières et sliders
        $banners = $this->entityManager->getRepository(Banner::class)->findAll();
        $endBanners = $this->entityManager->getRepository(EndBanner::class)->findAll();
        $secondarySliders = $this->entityManager->getRepository(SecondarySlider::class)->findAll();
        $thirdSliders = $this->entityManager->getRepository(ThirdSlider::class)->findAll();
        $fourthSliders = $this->entityManager->getRepository(FourthSlider::class)->findAll();
        $fifthSliders = $this->entityManager->getRepository(FifthSlider::class)->findAll();
        $sixthSliders = $this->productRepository->findLatestProducts($limit);

        // Transformation des données pour utilisation par le client
        $bannerData = array_map(function($banner) {
            return [
                'type' => $banner->getType(),
                'src' => $banner->getSrc(),
                'altText' => $banner->getAltText()
            ];
        }, $banners);

        $endBannerData = array_map(function($endBanner) {
            return [
                'type' => $endBanner->getType(),
                'src' => $endBanner->getSrc(),
                'altText' => $endBanner->getAltText()
            ];
        }, $banners);

        $secondarySliderData = array_map(function($slider) {
            return [
                'src' => $slider->getSrc(),
                'altText' => $slider->getAltText(),
                'caption' => $slider->getCaption()
            ];
        }, $secondarySliders);

        $thirdSliderData = array_map(function($slider) {
            return [
                'src' => $slider->getSrc(),
                'altText' => $slider->getAltText(),
                'caption' => $slider->getCaption()
            ];
        }, $thirdSliders);

        $fourthSliderData = array_map(function($slider) {
            return [
                'src' => $slider->getSrc(),
                'altText' => $slider->getAltText(),
                'caption' => $slider->getCaption()
            ];
        }, $fourthSliders);

        $fifthSliderData = array_map(function($slider) {
            return [
                'src' => $slider->getSrc(),
                'altText' => $slider->getAltText(),
                'caption' => $slider->getCaption()
            ];
        }, $fifthSliders);

        $sixthSliderData = array_map(function($slider) {
            return [
                'src' => $slider->getImage(),
                'altText' => $slider->getDescription(),
                'caption' => $slider->getName()
            ];
        }, $sixthSliders);

        return $this->render('home/index.html.twig', [
            'banners' => $bannerData,
            'endBanners' => $endBannerData,
            'secondarySliders' => $secondarySliderData,
            'thirdSliders' => $thirdSliderData,
            'fourthSliders' => $fourthSliderData,
            'fifthSliders' => $fifthSliderData,
            'sixthSliders' => $sixthSliderData,
        ]);
    }
}
