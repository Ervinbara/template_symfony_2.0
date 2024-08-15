<?php 

// tests/Controller/AuthControllerTest.php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class AuthControllerTest extends WebTestCase
{
    public function testRegisterPageIsSuccessful()
    {
        $client = static::createClient();
        $crawler = $client->request('GET', '/register');
    
        $this->assertResponseIsSuccessful();
    
        // Vérifier si le div avec l'ID 'register-root' existe
        $this->assertSelectorExists('#register-root');
    }
    
}