<?php

namespace App\Controller;

use App\Entity\MyWallet;
use App\Form\MyWalletType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    /**
     * @Route("/app/settings/new", name="settings")
     */
    public function new(Request $request): Response
    {

        $myWallet = new MyWallet();
        $form = $this->createForm(MyWalletType::class, $myWallet);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $myWallet->setUser($this->getUser());

            $em = $this->getDoctrine()->getManager();
            $em->persist($myWallet);
            $em->flush();
            return $this->redirectToRoute('settings');
        }

        return $this->render('default/index.html.twig', [
            'form' => $form->createView()
        ]);
    }
}
