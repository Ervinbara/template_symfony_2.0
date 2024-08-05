<?php

// src/Controller/HomeController.php

namespace App\Controller;

use App\Entity\Banner;
use App\Entity\FifthSlider;
use App\Entity\SixthSlider;
use App\Entity\ThirdSlider;
use App\Entity\FourthSlider;
use App\Entity\SecondarySlider;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class HomeController extends AbstractController
{
    // #[Route('/', name: 'app_home')]
    // public function index(): Response
    // {
    //     return $this->render('home/index.html.twig');
    // }
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }
    
    #[Route('/{reactRouting}', name: 'app_home', requirements: ['reactRouting' => '.*'], defaults: ['reactRouting' => null])]
    public function index(): Response
    {
        // Récupération des données des bannières et sliders
        $banners = $this->entityManager->getRepository(Banner::class)->findAll();
        $secondarySliders = $this->entityManager->getRepository(SecondarySlider::class)->findAll();
        $thirdSliders = $this->entityManager->getRepository(ThirdSlider::class)->findAll();
        $fourthSliders = $this->entityManager->getRepository(FourthSlider::class)->findAll();
        $fifthSliders = $this->entityManager->getRepository(FifthSlider::class)->findAll();
        $sixthSliders = $this->entityManager->getRepository(SixthSlider::class)->findAll();

        // Transformation des données pour utilisation par le client
        $bannerData = array_map(function($banner) {
            return [
                'type' => $banner->getType(),
                'src' => $banner->getSrc(),
                'altText' => $banner->getAltText()
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
                'src' => $slider->getSrc(),
                'altText' => $slider->getAltText(),
                'caption' => $slider->getCaption()
            ];
        }, $sixthSliders);

        return $this->render('home/index.html.twig', [
            'banners' => $bannerData,
            'secondarySliders' => $secondarySliderData,
            'thirdSliders' => $thirdSliderData,
            'fourthSliders' => $fourthSliderData,
            'fifthSliders' => $fifthSliderData,
            'sixthSliders' => $sixthSliderData,
        ]);
    }
}
