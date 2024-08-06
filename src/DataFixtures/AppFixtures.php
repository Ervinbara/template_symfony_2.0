<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Order;
use App\Entity\Banner;
use DateTimeImmutable;
use App\Entity\Product;
use App\Entity\Category;
use App\Entity\EndBanner;
use App\Entity\OrderItem;
use App\Entity\FifthSlider;
use App\Entity\SixthSlider;
use App\Entity\ThirdSlider;
use App\Entity\FourthSlider;
use App\Entity\SecondarySlider;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

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

        // Création de catégories
        $categoryNames = [
            'Vêtements',
            'Chaussures',
            'Accessoires',
        ];

        $productImages = [
            ['src' => '/images/sixth-slider/1.png', 'altText' => 'sixth Slider 1', 'caption' => 'Caption 1'],
            ['src' => '/images/sixth-slider/2.png', 'altText' => 'sixth Slider 2', 'caption' => 'Caption 3'],
            ['src' => '/images/sixth-slider/3.png', 'altText' => 'sixth Slider 3', 'caption' => 'Caption 3'],
            ['src' => '/images/sixth-slider/4.png', 'altText' => 'sixth Slider 4', 'caption' => 'Caption 4'],
            ['src' => '/images/sixth-slider/5.png', 'altText' => 'sixth Slider 5', 'caption' => 'Caption 5'],
            ['src' => '/images/sixth-slider/6.png', 'altText' => 'sixth Slider 6', 'caption' => 'Caption 6'],
            ['src' => '/images/sixth-slider/7.png', 'altText' => 'sixth Slider 7', 'caption' => 'Caption 7'],
            ['src' => '/images/sixth-slider/8.png', 'altText' => 'sixth Slider 8', 'caption' => 'Caption 8'],

        ];

        $categories = [];
        foreach ($categoryNames as $name) {
            $category = new Category();
            $category->setName($name);
            $category->setDescription("Description for $name");
            $category->setCreatedAt(new DateTimeImmutable());
            $category->setUpdatedAt(new DateTimeImmutable());
            $manager->persist($category);
            $categories[] = $category;
        }

        // Création de produits avec des noms distincts et ajout de catégories
        $productData = [
            ['name' => 'Tshirt Nike', 'category' => $categories[0]],
            ['name' => 'Jogging Nike', 'category' => $categories[0]],
            ['name' => 'Pantalon', 'category' => $categories[0]],
            ['name' => 'Jupe Rose', 'category' => $categories[0]],
            ['name' => 'Chaussures Adidas', 'category' => $categories[1]],
            ['name' => 'Casquette Puma', 'category' => $categories[2]],
            ['name' => 'Sweatshirt Under Armour', 'category' => $categories[0]],
            ['name' => 'Short de Sport', 'category' => $categories[0]],
            ['name' => 'Veste en Jean', 'category' => $categories[0]],
            ['name' => 'Robe d\'été', 'category' => $categories[0]]
        ];

        // Boucle pour créer des produits
        $products = [];
        foreach ($productData as $index => $data) {
            $product = new Product();
            $product->setName($data['name']);
            $product->setDescription("Description for {$data['name']}");
            $product->setPrice(mt_rand(10, 100));
            $product->setCategory($data['category']);

            // Assigner une image à chaque produit
            if (isset($productImages[$index])) {
                $product->setImage($productImages[$index]['src']);
            } else {
                $product->setImage("https://via.placeholder.com/150"); // Image par défaut si pas d'image
            }

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

        // Création de 2 bannières
        $banners = [
            ['type' => 'image', 'src' => '/images/banners/banner-roni.jpg', 'altText' => 'Banner 1'],
            // ['type' => 'image', 'src' => '/images/banners/roni.jpg', 'altText' => 'Banner 2'],
        ];

        $endBanners = [
            ['type' => 'image', 'src' => '/images/banners/roni.jpg', 'altText' => 'Banner 2'],
        ];

        foreach ($banners as $bannerData) {
            $banner = new Banner();
            $banner->setType($bannerData['type']);
            $banner->setSrc($bannerData['src']);
            $banner->setAltText($bannerData['altText']);
            $manager->persist($banner);
        }

        foreach ($endBanners as $bannerData) {
            $endBanners = new EndBanner();
            $endBanners->setType($bannerData['type']);
            $endBanners->setSrc($bannerData['src']);
            $endBanners->setAltText($bannerData['altText']);
            $manager->persist($endBanners);
        }

        // Création de 3 sliders secondaires
        $secondarySliders = [
            ['src' => '/images/secondary-slider/nike-child.jpg', 'altText' => 'Secondary Slider 1', 'caption' => 'Caption 1'],
            ['src' => '/images/secondary-slider/nike-shoes.png', 'altText' => 'Secondary Slider 2', 'caption' => 'Caption 2'],
            ['src' => '/images/secondary-slider/red-girl.jpg', 'altText' => 'Secondary Slider 3', 'caption' => 'Caption 3'],
            ['src' => '/images/secondary-slider/three-gyal.jpg', 'altText' => 'Secondary Slider 4', 'caption' => 'Caption 4'],
            ['src' => '/images/secondary-slider/victor.png', 'altText' => 'Secondary Slider 5', 'caption' => 'Caption 5'],
            ['src' => '/images/secondary-slider/nike-girls.jpg', 'altText' => 'Secondary Slider 6', 'caption' => 'Caption 6'],
        ];

        foreach ($secondarySliders as $sliderData) {
            $slider = new SecondarySlider();
            $slider->setSrc($sliderData['src']);
            $slider->setAltText($sliderData['altText']);
            $slider->setCaption($sliderData['caption']);
            $manager->persist($slider);
        }

        $thirdSliders = [
            ['src' => '/images/third-slider/1.jpg', 'altText' => 'Third Slider 1', 'caption' => 'Caption 1'],
            ['src' => '/images/third-slider/2.jpg', 'altText' => 'Third Slider 2', 'caption' => 'Caption 3'],
            ['src' => '/images/third-slider/3.jpg', 'altText' => 'Third Slider 3', 'caption' => 'Caption 3'],
            ['src' => '/images/third-slider/4.jpg', 'altText' => 'Third Slider 4', 'caption' => 'Caption 4'],
            ['src' => '/images/third-slider/5.jpg', 'altText' => 'Third Slider 5', 'caption' => 'Caption 5'],
            ['src' => '/images/third-slider/6.jpg', 'altText' => 'Third Slider 6', 'caption' => 'Caption 6'],
            ['src' => '/images/third-slider/7.jpg', 'altText' => 'Third Slider 7', 'caption' => 'Caption 7'],
            ['src' => '/images/third-slider/8.jpg', 'altText' => 'Third Slider 8', 'caption' => 'Caption 8'],
        ];

        foreach ($thirdSliders as $sliderData) {
            $slider = new ThirdSlider();
            $slider->setSrc($sliderData['src']);
            $slider->setAltText($sliderData['altText']);
            $slider->setCaption($sliderData['caption']);
            $manager->persist($slider);
        }

        $fourthSliders = [
            ['src' => '/images/fourth-slider/1.jpg', 'altText' => 'fourth Slider 1', 'caption' => 'Caption 1'],
            ['src' => '/images/fourth-slider/2.jpg', 'altText' => 'fourth Slider 2', 'caption' => 'Caption 3'],
            ['src' => '/images/fourth-slider/3.jpg', 'altText' => 'fourth Slider 3', 'caption' => 'Caption 3'],
            ['src' => '/images/fourth-slider/4.jpg', 'altText' => 'fourth Slider 4', 'caption' => 'Caption 4'],
            ['src' => '/images/fourth-slider/5.jpg', 'altText' => 'fourth Slider 5', 'caption' => 'Caption 5'],
            ['src' => '/images/fourth-slider/6.jpg', 'altText' => 'fourth Slider 6', 'caption' => 'Caption 6'],
            ['src' => '/images/fourth-slider/7.jpg', 'altText' => 'fourth Slider 7', 'caption' => 'Caption 7'],
            ['src' => '/images/fourth-slider/8.jpg', 'altText' => 'fourth Slider 8', 'caption' => 'Caption 8'],
        ];

        foreach ($fourthSliders as $sliderData) {
            $slider = new FourthSlider();
            $slider->setSrc($sliderData['src']);
            $slider->setAltText($sliderData['altText']);
            $slider->setCaption($sliderData['caption']);
            $manager->persist($slider);
        }

        $fifthSliders = [
            ['src' => '/images/fifth-slider/1.jpg', 'altText' => 'fifth Slider 1', 'caption' => 'Caption 1'],
            ['src' => '/images/fifth-slider/2.jpg', 'altText' => 'fifth Slider 2', 'caption' => 'Caption 3'],
            ['src' => '/images/fifth-slider/3.jpg', 'altText' => 'fifth Slider 3', 'caption' => 'Caption 3'],
            ['src' => '/images/fifth-slider/4.jpg', 'altText' => 'fifth Slider 4', 'caption' => 'Caption 4'],
        ];

        foreach ($fifthSliders as $sliderData) {
            $slider = new FifthSlider();
            $slider->setSrc($sliderData['src']);
            $slider->setAltText($sliderData['altText']);
            $slider->setCaption($sliderData['caption']);
            $manager->persist($slider);
        }

        $manager->flush();
    }
}
