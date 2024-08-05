<?php

namespace App\Controller;

use App\Entity\Banner;
use App\Entity\EndBanner;
use App\Entity\SecondarySlider;
use App\Entity\ThirdSlider;
use App\Entity\FourthSlider;
use App\Entity\FifthSlider;
use App\Entity\SixthSlider;
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

    // #[Route('/api/end-banners', name: 'api_end_banners', methods: ['GET'])]
    // public function getBanners(EntityManagerInterface $entityManager): Response
    // {
    //     $banners = $entityManager->getRepository(EndBanner::class)->findAll();

    //     $bannerData = array_map(function ($banner) {
    //         return [
    //             'type' => $banner->getType(),
    //             'src' => $banner->getSrc(),
    //             'altText' => $banner->getAltText(),
    //         ];
    //     }, $banners);

    //     return $this->json($bannerData);
    // }

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

    #[Route('/api/third-sliders', name: 'api_third_sliders', methods: ['GET'])]
    public function getThirdSliders(EntityManagerInterface $entityManager): Response
    {
        $sliders = $entityManager->getRepository(ThirdSlider::class)->findAll();

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
    public function getFourthSliders(EntityManagerInterface $entityManager): Response
    {
        $sliders = $entityManager->getRepository(FourthSlider::class)->findAll();

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
    public function getFifthSliders(EntityManagerInterface $entityManager): Response
    {
        $sliders = $entityManager->getRepository(FifthSlider::class)->findAll();

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
    public function getSixthSliders(EntityManagerInterface $entityManager): Response
    {
        $sliders = $entityManager->getRepository(SixthSlider::class)->findAll();

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
