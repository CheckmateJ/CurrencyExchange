<?php

namespace App\Controller;

use App\Entity\MyWallet;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class DashboardController extends AbstractController
{
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * @Route("/dashboard", name="dashboard")
     */
    public function index(SerializerInterface $serializer): Response
    {
        return $this->render('dashboard/index.html.twig', [
            'wallet' => $this->getMyWalletCurrency()[0],
            'rates' => $this->getMyWalletCurrency()[1]
        ]);
    }

    /**
     * @Route("/currency", name="currency_price")
     */
    public function getCurrentCurrencyPrice()
    {
        return new JsonResponse($this->getMyWalletCurrency()[1]);
    }


    public function getMyWalletCurrency()
    {
        $jsonCurrency = json_decode(file_get_contents('https://api.nbp.pl/api/exchangerates/tables/C/'));
        $wallet = $this->em->getRepository(MyWallet::class)->findAll();

        $currency = [];
        $rates = [];

        foreach ($wallet as $value) {
            $currency[] .= strtoupper($value->getCurrency());
        }

        foreach ($jsonCurrency[0]->rates as $rate) {
            if (in_array($rate->code, $currency) !== false) {
                $rates[] = $rate;
            }
        }
        return [$wallet, $rates];
    }
}
