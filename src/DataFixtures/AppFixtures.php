<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Product;
use App\Entity\Order;
use App\Entity\OrderItem;
use App\Entity\Banner;
use App\Entity\SecondarySlider; // Assurez-vous d'importer la classe
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use DateTimeImmutable;

class AppFixtures extends Fixture
{
    private $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager)
    {
        // Création de 5 utilisateurs
        $users = [];
        for ($i = 1; $i <= 5; $i++) {
            $user = new User();
            $user->setEmail("user$i@example.com");
            $user->setPassword($this->passwordHasher->hashPassword($user, 'password'));
            $user->setRoles(['ROLE_USER']);
            $manager->persist($user);
            $users[] = $user;
        }

        // Création de 10 produits
        $products = [];
        for ($j = 1; $j <= 10; $j++) {
            $product = new Product();
            $product->setName("Product $j");
            $product->setDescription("Description for product $j");
            $product->setPrice(mt_rand(10, 100));
            $product->setImage("https://via.placeholder.com/150"); // Associer une image depuis un lien internet
            $manager->persist($product);
            $products[] = $product;
        }

        // Création de 5 commandes avec des éléments de commande
        for ($k = 1; $k <= 5; $k++) {
            $order = new Order();
            $order->setUser($users[array_rand($users)]);
            $order->setTotalPrice(0);
            $order->setStatus('pending');
            $order->setCreatedAt(new DateTimeImmutable());
            $manager->persist($order);

            // Création d'éléments de commande pour chaque commande
            $totalPrice = 0;
            for ($l = 1; $l <= 3; $l++) {
                $product = $products[array_rand($products)];
                $quantity = mt_rand(1, 5);
                $price = $product->getPrice() * $quantity;

                $orderItem = new OrderItem();
                $orderItem->setOrderId($order);
                $orderItem->setProduct($product);
                $orderItem->setQuantity($quantity);
                $orderItem->setPrice($price);
                $manager->persist($orderItem);

                $totalPrice += $price;
            }

            $order->setTotalPrice($totalPrice);
        }

        // Création de 3 bannières
        $banners = [
            ['type' => 'image', 'src' => '/images/banners/banner-roni.jpg', 'altText' => 'Banner 1'],
            ['type' => 'image', 'src' => '/images/banners/banner-roni.jpg', 'altText' => 'Banner 2']
        ];

        foreach ($banners as $bannerData) {
            $banner = new Banner();
            $banner->setType($bannerData['type']);
            $banner->setSrc($bannerData['src']);
            $banner->setAltText($bannerData['altText']);
            $manager->persist($banner);
        }

        // Création de 3 sliders secondaires
        $secondarySliders = [
            ['src' => '/images/banners/banner-roni.jpg', 'altText' => 'Secondary Slider 1', 'caption' => 'Caption 1'],
            ['src' => '/images/banners/banner-roni.jpg', 'altText' => 'Secondary Slider 2', 'caption' => 'Caption 2'],
            ['src' => '/images/banners/banner-roni.jpg', 'altText' => 'Secondary Slider 3', 'caption' => 'Caption 3']
        ];

        foreach ($secondarySliders as $sliderData) {
            $slider = new SecondarySlider();
            $slider->setSrc($sliderData['src']);
            $slider->setAltText($sliderData['altText']);
            $slider->setCaption($sliderData['caption']);
            $manager->persist($slider);
        }

        $manager->flush();
    }
}
