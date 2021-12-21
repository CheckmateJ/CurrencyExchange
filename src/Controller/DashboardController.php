<?php

namespace App\Controller;

use App\Entity\AvailableMoney;
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
    public function index(): Response
    {

        $money = $this->em->getRepository(AvailableMoney::class)->findOneBy([]);

        return $this->render('dashboard/index.html.twig', [
            'wallet' => $this->getMyWalletCurrency()[0],
            'rates' => $this->getMyWalletCurrency()[1],
            'money' => $money
        ]);
    }

    /**
     * @Route("/currency/wallet", name="currency_wallet")
     */
    public function getCurrentCurrencyPrice()
    {
        return new JsonResponse($this->getMyWalletCurrency()[1]);
    }


    public function getMyWalletCurrency()
    {
        $jsonCurrency = json_decode(file_get_contents('https://api.nbp.pl/api/exchangerates/tables/C/'));
        $wallet = $this->em->getRepository(MyWallet::class)->findBy(['user' => $this->getUser()->getId()]);
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
