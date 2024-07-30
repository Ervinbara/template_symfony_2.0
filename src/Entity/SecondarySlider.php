<?php

namespace App\Entity;

use App\Repository\SecondarySliderRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SecondarySliderRepository::class)]
class SecondarySlider
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'string', length: 255)]
    private $src;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $altText;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $caption;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSrc(): ?string
    {
        return $this->src;
    }

    public function setSrc(string $src): self
    {
        $this->src = $src;
        return $this;
    }

    public function getAltText(): ?string
    {
        return $this->altText;
    }

    public function setAltText(?string $altText): self
    {
        $this->altText = $altText;
        return $this;
    }

    public function getCaption(): ?string
    {
        return $this->caption;
    }

    public function setCaption(?string $caption): self
    {
        $this->caption = $caption;
        return $this;
    }
}
