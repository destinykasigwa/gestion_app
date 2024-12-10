<?php
include("../connect.php");
// $a="maman";
// echo $a[0].$a[1];
$req = $pdo->query("SELECT * FROM mouvement");
$data = $req->fetchAll();
for ($i = 0; $i < sizeof($data); $i++) {
    $NumCompte = $data[$i]->id_membre;
    // echo $NumCompte[6]."<br>";
    $newNumber = substr($NumCompte, 6, 9);
    $newNumb = (string)$data[$i]->id_membre;
    //POUR LE FRANC
    if (strlen($newNumb) == 9) {
        $number = "3301000" . $newNumber . "202";
        echo $number . "<br>";
    } else if (strlen($newNumb) == 8) {
        $number = "33010000" . $newNumber . "202";
        echo $number . "<br>";
    } else if (strlen($newNumb) == 7) {
        $number = "330100000" . $newNumber . "202";
        // echo $number . "<br>";
    }

    //POUR LE DOLLARS

    if (strlen($newNumb) == 9) {

        $number2 = "3300000" . $newNumber . "201";
        echo $number2  . "<br>";
    } else if (strlen($newNumb) == 8) {
        $number2  = "33010000" . $newNumber . "201";
        echo $number2  . "<br>";
    } else if (strlen($newNumb) == 7) {
        $number2 = "330100000" . $newNumber . "201";
        // echo $number2  . "<br>";
    }


    $NumCompte = $data[$i]->id_membre;
    $NumAdherhant = "10" . substr($NumCompte, 6);
    // echo $NumAdherhant . "<br>";3300000179201
    $date = date('Y-m-d');
    // if ($data[$i]->montantDepotCDF > 0) {
    //     $insert = $pdo->prepare("INSERT INTO transactions (NumTransaction,DateTransaction,DateSaisie,TypeTransaction,CodeMonnaie,CodeAgence,NumCompte,Credit,Credit$,Creditfc,refCompteMembre) VALUES(?,?,?,?,?,?,?,?,?,?,?)");
    //     $insert->execute(array($data[$i]->refOperation, $data[$i]->date_mouvement2, $date, "C", "2", 20, $number, $data[$i]->montantDepotCDF, $data[$i]->montantDepotCDF / 2000, $data[$i]->montantDepotCDF, $NumAdherhant));
    // } else if ($data[$i]->montantRetraitCDF > 0) {
    //     $insert = $pdo->prepare("INSERT INTO transactions (NumTransaction,DateTransaction,DateSaisie,TypeTransaction,CodeMonnaie,CodeAgence,NumCompte,Debit,Debit$,Debitfc,refCompteMembre) VALUES(?,?,?,?,?,?,?,?,?,?,?)");
    //     $insert->execute(array($data[$i]->refOperation, $data[$i]->date_mouvement2, $date, "D", "2", 20, $number, $data[$i]->montantRetraitCDF, $data[$i]->montantRetraitCDF / 2000, $data[$i]->montantRetraitCDF, $NumAdherhant));
    // } else if ($data[$i]->montantDepotUSD > 0) {
    //     $insert = $pdo->prepare("INSERT INTO transactions (NumTransaction,DateTransaction,DateSaisie,TypeTransaction,CodeMonnaie,CodeAgence,NumCompte,Credit,Credit$,Creditfc,refCompteMembre) VALUES(?,?,?,?,?,?,?,?,?,?,?)");
    //     $insert->execute(array($data[$i]->refOperation, $data[$i]->date_mouvement2, $date, "C", "1", 20, $number2, $data[$i]->montantDepotUSD, $data[$i]->montantDepotUSD, $data[$i]->montantDepotUSD * 2000, $NumAdherhant));
    // } else if ($data[$i]->montantRetraitUSD > 0) {
    //     $insert = $pdo->prepare("INSERT INTO transactions (NumTransaction,DateTransaction,DateSaisie,TypeTransaction,CodeMonnaie,CodeAgence,NumCompte,Debit,Debit$,Debitfc,refCompteMembre) VALUES(?,?,?,?,?,?,?,?,?,?,?)");
    //     $insert->execute(array($data[$i]->refOperation, $data[$i]->date_mouvement2, $date, "D", "1", 20, $number2, $data[$i]->montantDepotUSD, $data[$i]->montantRetraitUSD, $data[$i]->montantRetraitUSD * 2000, $NumAdherhant));
    // }

    // $insert = $pdo->prepare("INSERT INTO comptes (CodeAgence,NumCompte,NomCompte,RefTypeCompte,RefCadre,RefGroupe,RefSousGroupe,CodeMonnaie,DateOuverture,NumAdherant) VALUES(?,?,?,?,?,?,?,?,?,?)");
    // $insert->execute(array(20, $number, $data[$i]->nomPostNom . " " .  $data[$i]->prenom, 3, 33, 330, 3300, 2, $date, $NumAdherhant));

    // $insertUSD = $pdo->prepare("INSERT INTO comptes (CodeAgence,NumCompte,NomCompte,RefTypeCompte,RefCadre,RefGroupe,RefSousGroupe,CodeMonnaie,DateOuverture,NumAdherant) VALUES(?,?,?,?,?,?,?,?,?,?)");
    // $insertUSD->execute(array(20, $number2,  $data[$i]->nomPostNom . " " .  $data[$i]->prenom, 3, 33, 330, 3300, 1, $date, $NumAdherhant));

    // //INSERT MEMBRE
    // $insert = $pdo->prepare("INSERT INTO adhesion_membres (CodeAgence,codeMonaie,intituleCompte,numCompte,dateOuverture,compteAbrege) VALUES(?,?,?,?,?,?)");
    // $insert->execute(array(20, "USD", $data[$i]->nomPostNom . " " .  $data[$i]->prenom, $number, $date, $NumAdherhant));
}

echo "okk";



//     $getRows = $pdo->query("SELECT * FROM agents");
//     $data = $getRows->fetchAll();




//     // $update = $pdo->query('UPDATE agents SET NumCompte="' . $number . '",NumCompteUSD="' . $number2 . '" WHERE NumCompte="' . $NumCompte . '"');
//     // echo 'success query';


//     // $numC = (string)$data[$i]->NumCompte;
//     // if (strlen($numC) == 9) {
//     //     echo "okkkk";
//     // } else {
//     //     echo "not ok..";
//     // }
// }
// $req = $pdo->query("SELECT * FROM agents");
// $data = $req->fetchAll();
// for ($i = 0; $i < sizeof($data); $i++) {
//     $NumCompte = $data[$i]->NumCompte;
//     $NumCompteUSD = $data[$i]->NumcompteUSD;
//     $NumAdherhant1 = substr($NumCompte, 7, 3);
//     $NumAdherhant2 = substr($NumCompteUSD, 7, 3);
//     $newNumb = (string)$data[$i]->NumCompte;
//     echo $NumAdherhant1 . "<br>";
//     echo $NumAdherhant2 . "<br>";

//     //POUR LE FRANC
//     // if (strlen($newNumb) == 9) {
//     //     $number = "3301000" . $newNumber . "202";
//     //     echo $number . "<br>";
//     // } else if (strlen($newNumb) == 8) {
//     //     $number = "33010000" . $newNumber . "202";
//     //     echo $number . "<br>";
//     // } else if (strlen($newNumb) == 7) {
//     //     $number = "330100000" . $newNumber . "202";
//     //     echo $number . "<br>";
//     // }

//     $insert = $pdo->prepare("INSERT INTO comptes (CodeAgence,NumCompte,NomCompte,RefTypeCompte,RefCadre,RefGroupe,RefSousGroupe,CodeMonnaie,NumAdherant) VALUES(?,?,?,?,?,?,?,?,?)");
//     $insert->execute(array(20, $data[$i]->NumCompte, $data[$i]->NomAgent, 3, 33, 330, 3300, 2, $NumAdherhant1));

//     $insertUSD = $pdo->prepare("INSERT INTO comptes (CodeAgence,NumCompte,NomCompte,RefTypeCompte,RefCadre,RefGroupe,RefSousGroupe,CodeMonnaie,NumAdherant) VALUES(?,?,?,?,?,?,?,?,?)");
//     $insertUSD->execute(array(20, $data[$i]->NumcompteUSD, $data[$i]->NomAgent, 3, 33, 330, 3300, 1, $NumAdherhant1));

//     //INSERT MEMBRE
//     $insert = $pdo->prepare("INSERT INTO adhesion_membres (CodeAgence,codeMonaie,intituleCompte,numCompte,compteAbrege) VALUES(?,?,?,?,?)");
//     $insert->execute(array(20, "USD", $data[$i]->NomAgent, $data[$i]->NumCompte, $NumAdherhant1));
// }

// echo "okkkk";



// $req = $pdo->query("SELECT * FROM agents");
// $dataUSD = $req->fetchAll();
// for ($i = 0; $i < sizeof($dataUSD); $i++) {
//     $NumCompte = $dataUSD[$i]->NumCompte;
//     $newNumber = substr($NumCompte, 6, 9);
//     $newNumb = (string)$dataUSD[$i]->NumCompte;
//     //POUR LE DOLLARS

//     if (strlen($newNumb) == 9) {
//         $number = "3300000" . $newNumber . "201";
//         echo $number . "<br>";
//     } else if (strlen($newNumb) == 8) {
//         $number = "33010000" . $newNumber . "201";
//         echo $number . "<br>";
//     } else if (strlen($newNumb) == 7) {
//         $number = "330100000" . $newNumber . "201";
//         echo $number . "<br>";
//     }

//     $update = $pdo->query('UPDATE agents SET NumcompteUSD="' . $number . '" WHERE NumCompte="' . $NumCompte . '"');
//     echo 'success query';


    // $numC = (string)$data[$i]->NumCompte;
    // if (strlen($numC) == 9) {
    //     echo "okkkk";
    // } else {
    //     echo "not ok..";
    // }
// }
