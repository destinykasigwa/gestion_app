<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\updateMembre;
use App\Http\Controllers\updateMembre;
use App\Http\Controllers\RetraitEspece;
use App\Http\Controllers\TFRController;
use Illuminate\Support\Facades\Artisan;
// use App\Http\Controllers\MendataireController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\ApproController;
use App\Http\Controllers\SoldeController;
use App\Http\Controllers\PostageController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\SendSMSController;
use App\Http\Controllers\DebiteurController;
use App\Http\Controllers\UserInfoController;
use App\Http\Controllers\CrediteurController;
use App\Http\Controllers\DelestageController;
use App\Http\Controllers\MendataireController;
use App\Http\Controllers\RemboursementEntendu;
use App\Http\Controllers\SMSbankingController;
use App\Http\Controllers\DepotEspeceController;
use App\Http\Controllers\PersonneLieController;
use App\Http\Controllers\SuiviCreditController;
use App\Http\Controllers\ComptabiliteController;
use App\Http\Controllers\EntreeTresorController;
use App\Http\Controllers\GetIndividualMendataire;
use App\Http\Controllers\JournalCaisseController;
use App\Http\Controllers\PayementAgentController;
use App\Http\Controllers\RapportCreditController;
use App\Http\Controllers\RemboursementController;
use App\Http\Controllers\RetraitEspeceController;
use App\Http\Controllers\AdhesionMembreController;
use App\Http\Controllers\RecuController;
use App\Http\Controllers\SommaireCompteController;
use App\Http\Controllers\RepertoireCaisseController;



header('Access-Control-Allow-Origin:  *');
header('Access-Control-Allow-Methods:  POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers:  Content-Type, X-Auth-Token, Origin, Authorization');
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return view('home');
// });

Auth::routes();
//MAIN ROUTES
Route::get('/',  [HomeController::class, 'index']);
Route::get('/home', [HomeController::class, 'index'])->name('home');
Route::get('/adhesion', [AdhesionMembreController::class, 'adhesion'])->name('membre.adhesion');
Route::get('/depot-espece', [DepotEspeceController::class, 'depot'])->name('depot.espece');
Route::get('/retrait-espece', [RetraitEspeceController::class, 'retrait'])->name('retrait.espece');
Route::get('/positionnement', [RetraitEspeceController::class, 'getPositionnement'])->name('retrait.positionnement');
Route::get('/appro', [ApproController::class, 'getApproPage'])->name('appro.approvisionnement');
Route::get('/delestage', [DelestageController::class, 'getDelestagePage'])->name('retour.delestage');
Route::get('/entre-tresor', [EntreeTresorController::class, 'getEntreeTresorPage'])->name('entree.tresor');
Route::get('/solde', [SoldeController::class, 'getSoldePage'])->name('membre.solde');
Route::get('/repertoirecaisse', [RepertoireCaisseController::class, 'getRepertoirePage'])->name('caisse.repertoire');
Route::get('/journal', [JournalCaisseController::class, 'getJournaCaissePage'])->name('caisse.journal');
Route::get('/suivicredit', [SuiviCreditController::class, 'getSuiviCreditPage'])->name('credit.suivi');
Route::get('/rapport-credit', [RapportCreditController::class, 'getRapportCreditPage'])->name('rapport.credit');
Route::get('/postage', [PostageController::class, 'getPostagePage'])->name('postage.caisse');
Route::get('/tfr', [TFRController::class, 'getTfrPage'])->name('tableau.tfr');
Route::get('/reports', [ReportsController::class, 'getReportsPage'])->name('tableau.reports');
Route::post('/reports', [ReportsController::class, 'getPortefeuilleData']);
Route::post('/bilan', [ReportsController::class, 'getBilan']);
Route::get('/remboursement-attendu', [ReportsController::class, 'getRembousementAttenduPage'])->name('remboursement.attendu');
Route::get('/crediteur', [CrediteurController::class, 'getCrediteurPage'])->name('credit.crediteur');
Route::get('/debiteur', [DebiteurController::class, 'getDebiteurPage'])->name('debit.debiteur');
Route::get('/payement-agent', [PayementAgentController::class, 'getPayementAgentPage'])->name('payement.agent');
Route::get('/comptabilite', [ComptabiliteController::class, 'getComptabilitePage'])->name('comptabilite.home');
Route::get('/sommaire-compte', [SommaireCompteController::class, 'getSommaireComptePage'])->name('compte.sommaire');
Route::resource("/createnew", "App\Http\Controllers\AdhesionMembreController")->except(["destroy", "update", "edit", "index"]);
Route::get('/users', [UserInfoController::class, 'getUsersPage'])->name('utilisateurs.users');
Route::resource("mendataire", "App\Http\Controllers\MendataireController")->except(["destroy", "update", "edit", "index"]);
Route::post(
    '/get/getindividual/mendataire/details',
    [GetIndividualMendataire::class, 'getMendatireDetails']
);

Route::get('/bar', [TestController::class, 'bar']);
Route::get('/send-sms', [SendSMSController::class, 'smsHomepage']);
Route::post('/send-sms', [SendSMSController::class, 'sendSms'])->name('send.sms');
Route::get('/sms-banking', [SMSbankingController::class, 'smsBankingHomepage'])->name("sms.banking");


//SAVE NEW MENDATAIRE
Route::post(
    "mendataire/save/data",
    [MendataireController::class, 'saveNewMendataire']
);

//GET SEARCHED MANDATAIRE
Route::get(
    "mendataire/getmendataire/data/{id}",
    [MendataireController::class, 'getMendataire']
);

//RECUPERE LES PERSONNE LIEES

Route::get(
    "personnelie/getpersonnelie/data/{id}",
    [PersonneLieController::class, 'getAllpersonneLie']
);

//CLEAR CACHE
Route::get('clear-cache', function () {
    $exitCode = Artisan::call('cache:clear');
    $existCode = Artisan::call('config:cache');
    return 'DONE'; //RETURN ANY THING
});

//updating a specific mendataire
Route::post(
    "/update/mendataire/data",
    [GetIndividualMendataire::class, 'updatingmendataire']
);
//get all personne liees
Route::get(
    "/personnelie/getpersonnelie/{id}",
    [PersonneLieController::class, 'getAllpersonneLie']
);

//get individual personne liee

Route::post(
    '/get/getindividual/personnelie/details',
    [PersonneLieController::class, 'getPersonneLieDetails']
);

//updating a specif personne lie
Route::post(
    "/update/personnelie/data",
    [PersonneLieController::class, 'updatingpersonnelie']
);

//add new personne liee

Route::post(
    "/newpersonnelie/addnew/",
    [PersonneLieController::class, 'createnew']
);

//delet a specifique mendataire

Route::delete(
    '/delete/mendataire/data/{idMendataire}',
    [GetIndividualMendataire::class, 'destroy']
);

//delete a specifique personne liee

Route::delete(
    '/delete/personnelie/data/{idPersonneLie}',
    [PersonneLieController::class, 'destroy']
);

//update membre

Route::post(
    "/update/membre/data",
    [updateMembre::class, 'updatingmembre']
);

//AJOUTE LA SIGNATURE POUR UN MEMBRE TITULAIRE DE COMPTE
Route::post('/membre/add-signature/data', [
    updateMembre::class,
    'saveSignatureMembre'
]);

//Activatate a new account

Route::post(
    "/activationcompte/membre/data",
    [updateMembre::class, 'activateAccount']
);

//getActived accounts
Route::get(
    "membre/compteactive/{id}",
    [updateMembre::class, 'activatedAccount']
);

//adding a photo to a member

Route::post(
    "/membre/addphoto",
    [updateMembre::class, 'uploadphoto']
);
// |--------------------------------------------------------------------------
// | Web Routes DEPOSIT
// |--------------------------------------------------------------------------
//saving a currency deposit

Route::post(
    "depot/espece",
    [DepotEspeceController::class, 'depotEspece']
);

//get searched account
Route::get(
    "/compte/search/{id}",
    [DepotEspeceController::class, 'getAccount']
);


//RECUPERE LES INFORMATIONS D'UN DOSSIER QUI A ETE POSITIONNER AFIN DE FAIRE LE RETRAIT



Route::get(
    "compte/search/numdossier/{numDocument}",
    [DepotEspeceController::class, 'getNumDocument']
);


//get billetage fom DB

Route::get(
    "/billetage/getbilletage",
    [DepotEspeceController::class, 'getBilletage']
);







// |--------------------------------------------------------------------------
// | Web Routes WITHDRAW
// |--------------------------------------------------------------------------
Route::post(
    "retrait/espece",
    [RetraitEspeceController::class, 'RetraitEspece']
);

//positionnement
Route::post(
    "positionnement/espece",
    [RetraitEspeceController::class, 'positionnementEspece']
);

//RECUPERE TOUTES LES OPERATIONS POSITIONNEES

Route::get(
    "positionnement/getalloperation",
    [RetraitEspeceController::class, 'getAllPositionnement']
);

//GET ALL CAISSIER FROM DBnpm

Route::get(
    "appro/getcaissier",
    [ApproController::class, 'getAllCaissier']
);

//SAVE OPERATION FOR APPRO CAISSIER

Route::post(
    "appro/savenewappro",
    [ApproController::class, 'saveNewApproCaissier']
);

//GET DAYLY APPRO
Route::get(
    "appro/journalier",
    [ApproController::class, 'getDaylyAppro']
);

//GET DAYLY APPRO FOR SPECIFIC CAISSER (USER)
Route::get(
    "appro/received",
    [ApproController::class, 'getDaylyApproUser']
);


//REMOVE E SPECIFIQUE APPRO ITEM CDF
Route::delete(
    "/delete/appro/cdf/{id}",
    [ApproController::class, 'destroy']
);

//REMOVE E SPECIFIQUE APPRO ITEM USD
Route::delete(
    "/delete/appro/usd/{id}",
    [ApproController::class, 'destroyusd']
);

//ACCEPT A SPECIF APPRRO FOR A SPECIFIQUE USER CDF

Route::delete(
    "accept/appro/cdf/{id}",
    [ApproController::class, 'acceptApproCDF']
);

//ACCEPT A SPECIF APPRRO FOR A SPECIFIQUE USER USD

Route::delete(
    "accept/appro/usd/{id}",
    [ApproController::class, 'acceptApproUSD']
);

//GET SUM  OF BILLETAGE
Route::get(
    "billetage/sommebilletage",
    [DelestageController::class, 'getAllBilletage']
);


//GET NEW BILLETAGE ATFER DOING A CHANGE MONNEY OPERATION
Route::get(
    "billetage/nouvel",
    [DelestageController::class, 'getNewBilletage']
);

//UPDATE BILLETAGE CDF
Route::post(
    "delestage/update/cdf",
    [DelestageController::class, 'upDateBilletageCDF']
);

//UPDATE BILLETAGE USD
Route::post(
    "delestage/update/usd",
    [DelestageController::class, 'upDateBilletageUSD']
);

//DELESTAGE CDF
Route::post(
    "delestage/delestage/cdf",
    [DelestageController::class, 'delestageCDF']
);

//DELESTAGE CDF
Route::post(
    "delestage/delestage/usd",
    [DelestageController::class, 'delestageUSD']
);

//DELESTAGE AU CAS OU L'UTILISATEUR A MET A JOUR LE BILLETAGE CDF
Route::get(
    "delestage/echange/cdf",
    [DelestageController::class, 'delestageChangeMCDF']
);

//DELESTAGE AU CAS OU L'UTILISATEUR A MET A JOUR LE BILLETAGE USD
Route::get(
    "delestage/echange/usd",
    [DelestageController::class, 'delestageChangeMUSD']
);

//GET ALL DELESTAGE REQUEST

Route::get(
    "delestage/billetage/all",
    [EntreeTresorController::class, 'getDelestageRequest']
);


//REMOVE A SPECIFIC DELESTAGE ITEM CDF
Route::delete(
    "/delete/delestage/cdf/{id}",
    [EntreeTresorController::class, 'removeItemDeletstageCDF']
);

//REMOVE A SPECIFIC DELESTAGE ITEM CDF
Route::delete(
    "/delete/delestage/usd/{id}",
    [EntreeTresorController::class, 'removeItemDeletstageUSD']
);

//CONFIRM A SPECIF DELESTAGE ITEM CDF
Route::get(
    "delestage/accept/cdf/{id}",
    [EntreeTresorController::class, 'confirmDeletstageRequestCDF']
);


//CONFIRM A SPECIF DELESTAGE ITEM USD
Route::get(
    "delestage/accept/usd/{id}",
    [EntreeTresorController::class, 'confirmDeletstageRequestUSD']
);

//GET RELEVE
Route::post(
    "membre/releve/data",
    [SoldeController::class, 'getReleveMembre']
);

//GET RELEVE
Route::get(
    "membre/releve/data/search/{item}",
    [SoldeController::class, 'searcheItem']
);



//GET REPERTOIRE DATA
Route::post(
    "/rapport/repertoire/caisse",
    [RepertoireCaisseController::class, 'getRepertoire']
);

//GET JOURNAL DATA
Route::post(
    "/rapport/journal/caisse",
    [JournalCaisseController::class, 'getJournal']
);





//RECHERCHE UN NUMERO DE COMPTE POUR LE MONTAGE DE CREDIT
Route::post(
    "credit/search",
    [SuiviCreditController::class, 'getInfoCompte']
);

//QD ON CLIC SUR LE BOUTON NOUVEAU CREDIT
Route::post(
    "credit/nouveau",
    [SuiviCreditController::class, 'getNewDossierNumber']
);

//ENREGISTRE UN NOUVEL MONTAGE DE CREDIT
Route::post(
    "credit/montagecredit",
    [SuiviCreditController::class, 'saveNewMontageCredit']
);

//MET A JOUR LE CEDIT
Route::post(
    "montage/credit/update",
    [SuiviCreditController::class, 'upDateCredit']
);

//ENREGISTRE L'ECHEANCIER

Route::post(
    "credit/echeancier/generate",
    [SuiviCreditController::class, 'saveEcheancier']
);
//MET A JOUR L'ECHEANCIER
Route::post(
    "montage/credit/update/echeancier",
    [SuiviCreditController::class, 'upDateEcheancier']
);


//PERMET D'ACCORDER UN CREDIT
Route::post(
    "credit/accord",
    [SuiviCreditController::class, 'AccordCredit']
);

//PERMET DE DECAISSER UN CREDIT UN CREDIT
Route::post(
    "credit/decaissement",
    [SuiviCreditController::class, 'DeccaissementCredit']
);

//PERMET DE CLOTURE UN CREDIT
Route::post(
    "
    credit/cloture",
    [SuiviCreditController::class, 'ClotureCredit']
);

//RECUPERE LE RAPPORT CREDIT
Route::get(
    "
    rapport/data",
    [RapportCreditController::class, 'getRapportCredit']
);

//PERMET D'AFICHER L'ECHEANCIER
Route::post(
    "
    rapport/echeancier",
    [RapportCreditController::class, 'getEcheancier']
);

//RECUPERE LE TABLEAU D'AMMORTISSEMENT DU CREDIT
Route::post(
    "
    rapport/tableau-ammortisement",
    [RapportCreditController::class, 'getTableauAmmortissement']
);

//RECUPERE LE TABLEAU D'AMMORTISSEMENT DU CREDIT
Route::post(
    "
    rapport/balance-agee",
    [RapportCreditController::class, 'getTableauBalanceAgee']
);

//PERMET D'EFFECTUER UN REMBOURSEMENT MANUEL CAPITAL
Route::post(
    "
    credit/remboursement/capital",
    [RemboursementController::class, 'remboursementEnCapital']
);

//PERMET D'EFFECTUER UN REMBOURSEMENT MANUEL INTERET
Route::post(
    "
    credit/remboursement/interet",
    [RemboursementController::class, 'remboursementEnInteret']
);

//CLOTURE DE LA JOURNEE EN COURS
Route::get(
    "
    cloture/journee",
    [PostageController::class, 'clotureJournee']
);

//PERMET DE DEFINIR LA DATE DU SYSTEME
Route::post(
    "
    datesystem/definir",
    [PostageController::class, 'definrDateSysteme']
);

//RECUPERE LES INFORMATIONS A AFFICHER SUR LE TFR
Route::post(
    "
    etat-financier/tfr/data",
    [TFRController::class, 'getTFRData']
);

//PERMET DE RECHERCHE UN NUMERO DE COMPTE 
Route::get(
    "
    compte/credit/search/{compte}",
    [CrediteurController::class, 'getAccount']
);

//SAVE DATA 
Route::post(
    "
    crediteur/save/data",
    [CrediteurController::class, 'saveDataCredit']
);

//PERMET D'OBTENIR LES INFORMATION D'UN COMPTE SUR LE QUEL ON VEUT EFFECTUER UN CREDIT 
Route::post(
    "
    compte/debiteur/search/credit",
    [DebiteurController::class, 'getDataCredit']
);

//PERMET D'OBTENIR LES INFORMATION D'UN COMPTE SUR LE QUEL ON VEUT EFFECTUER UN DEBIT
Route::post(
    "
    compte/debiteur/search/debit",
    [DebiteurController::class, 'getDataDebit']
);

//ENREGISTRE L'OPERATION POUR LE MENU DEBITEUR

Route::post(
    "
    debiteur/save/data",
    [DebiteurController::class, 'saveDataDebit']
);

//RECUPERE TOUTES LES OPERATIONS JOURNALIERES DU COMPTABLE

Route::get(
    "compte/operation/journalier/debiteur",
    [DebiteurController::class, 'getDailyOperation']
);



//PERMET DE RECHERCHER UNE OPERATION MOYENNANT SA REFERENCE
Route::get(
    "compte/search/operation/reference/{ref}",
    [DebiteurController::class, 'getSearchedOperation']
);

//PERMET D'EXTOURNER UNE OPERATION
Route::get(
    "compte/extourne/operation/{reference}",
    [DebiteurController::class, 'extourneOperation']
);

//RECUPERE TOUT LES AGENTS
Route::get(
    "agent/data/all",
    [PayementAgentController::class, 'getAgent']
);

//PERMET DE SAUVEGARDER LE PAYEMENT DES AGENT

Route::post(
    "payement/agent/data",
    [PayementAgentController::class, 'savePayementAgent']
);

//PERMET DE RECUPERER LES PAYEMENTS EFFECTUES

Route::post(
    "payement/agent/getpayement",
    [PayementAgentController::class, 'getAgentPayement']
);

//PERMET D'ENREGISTRER UN NOUVEAU AGENT

Route::post(
    "payement/agent/addnewAgent",
    [PayementAgentController::class, 'addNewAgent']
);

//MET LA JOUR LA DATE DE PAIEMENT DES AGENT


Route::post(
    "payement/agent/moispayement/save",
    [PayementAgentController::class, 'updateDatePayementAgent']
);


//PERMET D'OBTENIR LES UTILISATEURS 
Route::get(
    "get/users/data",
    [JournalCaisseController::class, 'getUsers']
);

//RECUPERE LES COMPTES DE CHARGE

Route::get(
    "comptabilite/compte/data",
    [ComptabiliteController::class, 'getComptesCharge']
);

//PERMET DE PASSE UNE ECRITURE COMPTABLE DE DEBIT
Route::post(
    "compte/debit/data/save",
    [ComptabiliteController::class, 'saveDataDebit']
);

//RECUPERE TOUTES LES OPERATION DE CHARGE JOURNALIER EFFECTUEES
Route::get(
    "compte/operation/journalier/charge",
    [ComptabiliteController::class, 'getDailyOperationCharge']
);

//PERMET DE PASSER UNE ECRITURE COMPTABLE CREDIT
Route::post(
    "compte/credit/data",
    [ComptabiliteController::class, 'saveDataCredit']
);

//PERMET D'AJOUTER UN NOUVEAU COMPTE DE LA COMPTABILITE
Route::post(
    "compte/nouveau/data",
    [ComptabiliteController::class, 'saveNewAccount']
);

//RECUPERE LE SOMMAIRE DE COMPTE
Route::post(
    "sommaire/compte/data",
    [SommaireCompteController::class, 'getSommaireCompte']
);

//CHECK THE ROLE OF USER

Route::get(
    "/users/getUserInfo",
    [UserInfoController::class, "getUserRole"]
);

//PERMET DE RECUPERE LES INFORMATIONS D'UN UTILISATEUR RECHERCHE

Route::get(
    "/users/getUser/{item}",
    [UserInfoController::class, "getUserR"]
);

//PERMET DE RECUPERE LES INFORMATIONS DU MEMBRE RECHERCHE

Route::get(
    "/users/getmembreinfo/{item}",
    [UserInfoController::class, "getMembreR"]
);

//PERMET DE BLOQUER UN UTILISATEUR
Route::get(
    "/users/lockuser/{item}",
    [UserInfoController::class, "lockUser"]
);

//PERMET DE RENDRE UN UTILISATEUR ADMIN
Route::get(
    "/users/make-user-admin/{item}",
    [UserInfoController::class, "makeAdmin"]
);

//CREATE CAISSIER ACCOUNT

Route::get(
    "/users/creat-caissier-account/{item}",
    [UserInfoController::class, "createCaissierAccount"]
);




//PERMET DE RENDRE UN UTILISATEUR ADMIN
Route::post(
    "/users/linkuser",
    [UserInfoController::class, "linkUser"]
);

//PERMET DE RENDRE UN UTILISATEUR AGENT DE CREDIT

Route::get(
    "/users/make-agent-credit/{item}",
    [UserInfoController::class, "makeAgentCredit"]
);

//PERMET DE RENDRE UN UTILISATEUR CAISSIER
Route::get(
    "/users/make-caissier/{item}",
    [UserInfoController::class, "makeCaissier"]
);

//PEREMET DE RECUPERER LE REMBOURSEMENT ATTENDU
Route::post(
    "/rapport/data/remboursement-attendu",
    [RapportCreditController::class, "getRemboursAttendu"]

);

//GET DEFAULT DATE FOR REMBOURSEMENT ATTENDU


Route::get(
    "/rapport/data/remboursement-attendu/defaultdate",
    [RapportCreditController::class, "getRemboursAttenduDefaultDate"]

);
//ADD NEW CUSTOMER ON SMS BANKING QUESTION
Route::post(
    "/sms-banking/add-new-costomer/question",
    [SMSbankingController::class, "AddNewCustomerQuestion"]

);
//ADD NEW CUSTOMER ON SMS BANKING VALIDATE
Route::post(
    "/sms-banking/add-new-costomer",
    [SMSbankingController::class, "AddNewCustomer"]

);

//GET LASTEST SMSBANKING USERS
Route::get(
    "/sms-banking/getlastest",
    [SMSbankingController::class, "getLastestSMSBankingUsers"]

);

//GET SEARCHED ELEMENT FOR SMS-BANKING

Route::get(
    "/sms-banking/search/user/{item}",
    [SMSbankingController::class, "getSearchedSMSBankingUsers"]

);

Route::get(
    "/sms-banking/activate-user/msg/{item}",
    [SMSbankingController::class, "ActivateUserOnSMSBanking"]

);

Route::get(
    "/sms-banking/activate-user/email/{item}",
    [SMSbankingController::class, "ActivateUserOnEmailBanking"]
);

//DELETE A USER ON SMS BANKING
Route::delete(
    "/sms-banking/delete/item/{item}",
    [SMSbankingController::class, "deleteAnItemOnSmsBanking"]
);

//GET A USER DETAIL FOR SMS BANKING

Route::post(
    "/sms-banking/update/user-details",
    [SMSbankingController::class, "getIndividualUserDetails"]
);

//UPDATE USER ON SMS BANKING
Route::post(
    "/sms-banking/update/user/data",
    [SMSbankingController::class, "upDateUserOnSMSBanking"]
);


//OPEN DAY ON THE SYSTEM

Route::post(
    "postage/openday/data",
    [PostageController::class, "openNewday"]
);

//RECUPERE LE RECU DE RETRAIT


Route::get(
    "rapport/recu/retrait",
    [RecuController::class, "recuRetrait"]
);

//GET RECU RETRAIT PAGE

Route::get(
    "/recu-retrait",
    [RecuController::class, "getPrintPageRetrait"]
);

//GET RECU DEPOT

Route::get(
    "rapport/recu/depot",
    [RecuController::class, "recuDepot"]
);

//GET RECU DEPOT PAGE

Route::get(
    "/recu-depot",
    [RecuController::class, "getPrintPageDepot"]
);
