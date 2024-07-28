<?php

namespace App\Entity;

use App\Entity\Payment;
use App\Entity\ReturnRequest;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\OrderRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

#[ORM\Entity(repositoryClass: OrderRepository::class)]
#[ORM\Table(name: '`order`')]
class Order
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'orders')]
    private ?user $user = null;

    #[ORM\Column(nullable: true)]
    private ?float $totalPrice = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $status = null;

    #[ORM\OneToOne(mappedBy: 'p_order', cascade: ['persist', 'remove'])]
    private ?Payment $payment = null;

        /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Address")
     * @ORM\JoinColumn(nullable=false)
     */
    private $shippingAddress;

    public function getShippingAddress(): ?Address
    {
        return $this->shippingAddress;
    }

    public function setShippingAddress(?Address $shippingAddress): self
    {
        $this->shippingAddress = $shippingAddress;

        return $this;
    }

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    /**
     * @var Collection<int, OrderItem>
     */
    #[ORM\OneToMany(targetEntity: OrderItem::class, mappedBy: 'order_id')]
    private Collection $orderItems;

    /**
     * @var Collection<int, ReturnRequest>
     */
    #[ORM\OneToMany(targetEntity: ReturnRequest::class, mappedBy: 'order_id_return')]
    private Collection $returnRequests;

    public function __construct()
    {
        $this->orderItems = new ArrayCollection();
        $this->returnRequests = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?user
    {
        return $this->user;
    }

    public function setUser(?user $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getTotalPrice(): ?float
    {
        return $this->totalPrice;
    }

    public function setTotalPrice(?float $totalPrice): static
    {
        $this->totalPrice = $totalPrice;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(?string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getPayment(): ?Payment
    {
        return $this->payment;
    }

    public function setPayment(?Payment $payment): static
    {
        // unset the owning side of the relation if necessary
        if ($payment === null && $this->payment !== null) {
            $this->payment->setPOrder(null);
        }

        // set the owning side of the relation if necessary
        if ($payment !== null && $payment->getPOrder() !== $this) {
            $payment->setPOrder($this);
        }

        $this->payment = $payment;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * @return Collection<int, OrderItem>
     */
    public function getOrderItems(): Collection
    {
        return $this->orderItems;
    }

    public function addOrderItem(OrderItem $orderItem): static
    {
        if (!$this->orderItems->contains($orderItem)) {
            $this->orderItems->add($orderItem);
            $orderItem->setOrderId($this);
        }

        return $this;
    }

    public function removeOrderItem(OrderItem $orderItem): static
    {
        if ($this->orderItems->removeElement($orderItem)) {
            // set the owning side to null (unless already changed)
            if ($orderItem->getOrderId() === $this) {
                $orderItem->setOrderId(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ReturnRequest>
     */
    public function getReturnRequests(): Collection
    {
        return $this->returnRequests;
    }

    public function addReturnRequest(ReturnRequest $returnRequest): static
    {
        if (!$this->returnRequests->contains($returnRequest)) {
            $this->returnRequests->add($returnRequest);
            $returnRequest->setOrderIdReturn($this);
        }

        return $this;
    }

    public function removeReturnRequest(ReturnRequest $returnRequest): static
    {
        if ($this->returnRequests->removeElement($returnRequest)) {
            // set the owning side to null (unless already changed)
            if ($returnRequest->getOrderIdReturn() === $this) {
                $returnRequest->setOrderIdReturn(null);
            }
        }

        return $this;
    }
}
