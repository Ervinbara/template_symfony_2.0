<?php

namespace App\Form;

use App\Entity\Address;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\CountryType;

class AddressType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('street', TextType::class, [
                'label' => 'Rue',
            ])
            ->add('city', TextType::class, [
                'label' => 'Ville',
            ])
            ->add('state', TextType::class, [
                'label' => 'État',
            ])
            ->add('zipcode', TextType::class, [
                'label' => 'Code Postal',
            ])
            ->add('country', CountryType::class, [
                'label' => 'Pays',
                'placeholder' => 'Choisissez un pays',
                'preferred_choices' => ['FR', 'US', 'GB'], // Optionnel : Préférences pour certains pays
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Address::class,
        ]);
    }
}
