<style>
    .disabledLink {
        pointer-events: none;
        cursor: default;
        color: #cff !important;
    }
</style>
<?php
use Illuminate\Support\Facades\DB;
$dateSaisie = DB::select('SELECT DateTaux FROM taux_journaliers ORDER BY id DESC LIMIT 1')[0];
$userInfo = DB::select('SELECT * FROM users WHERE id="' . Auth::user()->id . '"')[0];
$checkIfClosedDay = DB::select('SELECT DateSysteme,closed FROM closed_days   ORDER BY id DESC LIMIT 1')[0];

?>
<?php
if($userInfo->locked==1){?>
<p style="color: red;padding:5px;margin:3px"> <strong>Vous êtes bloqué(e) <br>Veuillez contacter <br> l'administrateur.
    </strong> </p>
<?php }else if($checkIfClosedDay->closed==1 and $userInfo->SuperRole != 1) {?>
<p style="color: red;padding:5px;margin:3px">
    {{-- <strong>Cette jounée est déjà clôturée <br>Veuillez contacter <br>
        l'administrateur.
    </strong>  --}}
</p>
<?php }else {?>
<aside class="main-sidebar sidebar-dark-primary elevation-4"
    style="font-size: 16px; font-family: Tahoma, 'Times New Roman', 'Sans-Serif' !important;font-weight:bold">

    <a href="home" class="brand-link"
        style="font-size: 16px font-family: Tahoma, 'Times New Roman', 'Sans-Serif' !important;">
        <img src="{{ asset('dist/img/AdminLTELogo.png') }}" alt="AdminLTE Logo" class="brand-image img-circle elevation-3"
            style="opacity: .8">
        <span class="brand-text font-weight-light">IHDEMUNIS ASBL</span>
    </a>

    <div class="sidebar">

        <nav class="mt-2">
            <?php 
                       if ($userInfo->Role == 1)  {?>
            <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu"
                data-accordion="false">
                <li class="nav-item">
                    {{-- menu-open --}}
                    <a href="#" class="nav-link active">
                        <i class="fas fa-tasks"></i>
                        <p>
                            OPERATION
                            <i class="right fas fa-angle-left"></i>
                        </p>
                    </a>
                    <?php if($userInfo->caissier==1) {?>
                    <ul class="nav nav-treeview">
                        <?php 
                       if ($userInfo->caissier == 1)  {?>
                        <li class="nav-item">
                            <a href="{{ route('depot.espece') }}" class="nav-link">
                                <i class="fas fa-money-bill"></i>
                                <p>Dépot</p>
                            </a>
                        </li>

                        <li class="nav-item">
                            <a href="{{ route('retrait.espece') }}" class="nav-link">
                                <i class="fas fa-money-bill"></i>
                                <p>Retrait</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="{{ route('retrait.positionnement') }}" class="nav-link">
                                <i class="fas fa-money-check"></i>

                                <p>Visa</p>
                            </a>
                        </li>
                        <?php }else {?>
                        <li class="nav-item">
                            <a href="{{ route('depot.espece') }}" class="nav-link disabledLink">
                                <i class="fas fa-money-bill"></i>
                                <p>Dépot</p>
                            </a>
                        </li>

                        <li class="nav-item">
                            <a href="{{ route('retrait.espece') }}" class="nav-link disabledLink">
                                <i class="fas fa-money-bill"></i>
                                <p>Retrait</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="{{ route('retrait.positionnement') }}" class="nav-link disabledLink">
                                <i class="fas fa-money-check"></i>

                                <p>Visa</p>
                            </a>
                        </li>
                        <?php } ?>

                        <?php  if ($userInfo->chefcaisse == 1)  {?>
                        <li class="nav-item">
                            <a href="{{ route('appro.approvisionnement') }}" class="nav-link">
                                <i class="fas fa-hand-holding-usd"></i>
                                <p>Appro</p>
                            </a>
                        </li>
                        <?php }else {?>
                        <li class="nav-item">
                            <a href="{{ route('appro.approvisionnement') }}" class="nav-link disabledLink">
                                <i class="fas fa-hand-holding-usd"></i>
                                <p>Appro</p>
                            </a>
                        </li>
                        <?php }?>
                        <li class="nav-item">
                            <a href="{{ route('retour.delestage') }}" class="nav-link">
                                <i class="fas fa-sack-dollar"></i>
                                <p>Delestage</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="" class="nav-link">
                                <i class="fas fa-money-check"></i>

                                <p>Virement</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="{{ route('retour.delestage') }}" class="nav-link">

                                <i class="fas fa-exchange"></i>
                                <p>Echange</p>
                            </a>
                        </li>

                        <li class="nav-item">
                            <a href="{{ route('membre.solde') }}" class="nav-link">
                                <i class="fas fa-pen"></i>
                                <p>Relevé cpte</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="{{ route('caisse.journal') }}" class="nav-link">
                                <i class="fas fa-book"></i>
                                <p>Journal</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="{{ route('caisse.repertoire') }}" class="nav-link">
                                <i class="fas fa-shopping-cart"></i>
                                <p>Repertoire C</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="{{ route('entree.tresor') }}" class="nav-link">
                                <i class="fas fa-ad"></i>
                                <p>Entrée T</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="{{ route('appro.approvisionnement') }}" class="nav-link">
                                <i class="fas fa-eraser"></i>
                                <p>Sortie T</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="{{ route('debit.debiteur') }}" class="nav-link">
                                <i class="fas fa-hand-holding-usd"></i>
                                <p>Débiteur</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="{{ route('credit.crediteur') }}" class="nav-link">
                                <i class="fas fa-money-bill"></i>
                                <p>Créditeur</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="{{ route('membre.adhesion') }}" class="nav-link">
                                <i class="fas fa-users"></i>
                                <p>Adhésion</p>
                            </a>
                        </li>
                    </ul>
                    <?php }else if($userInfo->chefcaisse==1){?>
                <li class="nav-item">
                    <a href="{{ route('appro.approvisionnement') }}" class="nav-link">
                        <i class="fas fa-hand-holding-usd"></i>
                        <p>Appro</p>
                    </a>
                </li>


                <?php   }?>
                </li>
                <?php if($userInfo->comptable==1) {?>
                <li class="nav-item">
                    <a href="{{ route('comptabilite.home') }}" class="nav-link">
                        <i class="fas fa-hand-holding-usd"></i>
                        <p>Comptabilité</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="{{ route('debit.debiteur') }}" class="nav-link">
                        <i class="fas fa-hand-holding-usd"></i>
                        <p>Débiteur</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="{{ route('credit.crediteur') }}" class="nav-link">
                        <i class="fas fa-money-bill"></i>
                        <p>Créditeur</p>
                    </a>
                </li>

                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="fas fa-money-bill"></i>
                        <p>
                            Payement Agent
                            <i class="fas fa-angle-left right"></i>
                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        <li class="nav-item">
                            <a href="{{ route('payement.agent') }}" class="nav-link">
                                <i class="fas fa-money-bill"></i>
                                <p>Payement</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="" class="nav-link">
                                <i class="fas fa-file"></i>
                                <p>Bulletin de paie</p>
                            </a>
                        </li>

                    </ul>
                </li>
                <?php }?>

                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="fas fa-tasks"></i>
                        <p>
                            Administration
                            <i class="fas fa-angle-left right"></i>

                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        <li class="nav-item">
                            <a href="{{ route('postage.caisse') }}" class="nav-link">
                                <i class="fas fa-donate"></i>
                                <p>Taux</p>
                            </a>
                        </li>
                        {{-- <li class="nav-item">
                            <a href="" class="nav-link">
                                <i class="fas fa-calendar-alt"></i>
                                <p>Date de saisie</p>
                            </a>
                        </li> --}}
                        <li class="nav-item">
                            <a href="{{ route('postage.caisse') }}" class="nav-link">
                                <i class="fas fa-door-closed"></i>
                                <p>Postage</p>
                            </a>
                        </li>
                        {{-- <li class="nav-item">
                            <a href="" class="nav-link">
                                <i class="fas fa-users"></i>
                                <p>Clientèle</p>
                            </a>
                        </li> --}}
                        {{-- <li class="nav-item">
                            <a href="" class="nav-link">
                                <i class="fas fa-compact-disc"></i>
                                <p>Back up</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="" class="nav-link">
                                <i class="fas fa-envelope"></i>
                                <p>Envoie Email</p>
                            </a>
                        </li> --}}
                        <li class="nav-item">
                            <a href="{{ route('sms.banking') }}" class="nav-link">
                                <i class="fas fa-sms"></i>
                                <p>SMS Banking</p>
                            </a>
                        </li>
                    </ul>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="fas fa-tasks"></i>
                        <p>
                            Gestion de crédit
                            <i class="right fas fa-angle-left"></i>
                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        {{-- <li class="nav-item">
                            <a href="pages/charts/chartjs.html" class="nav-link">
                                <i class="far fa-circle nav-icon"></i>
                                <p>ChartJS</p>
                            </a>
                        </li> --}}
                        <li class="nav-item">
                            <a href="{{ route('credit.suivi') }}" class="nav-link">
                                <i class="fas fa-cogs"></i>
                                <p>Montage crédit</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="" class="nav-link">
                                <i class="fas fa-balance-scale"></i>
                                <p>Balance Agée</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="{{ route('rapport.credit') }}" class="nav-link">
                                <i class="fas fa-file"></i>
                                <p>Rapport crédit</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="{{ route('remboursement.attendu') }}" class="nav-link">
                                <i class="fas fa-money-bill"></i>
                                <p>Rembours attendus</p>
                            </a>
                        </li>

                    </ul>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="fas fa-tasks"></i>
                        <p>
                            RAPPORT
                            <i class="fas fa-angle-left right"></i>
                        </p>
                    </a>
                    <ul class="nav nav-treeview">

                        <li class="nav-item">

                            <a href="{{ route('compte.sommaire') }}" class="nav-link">
                                <i class="fas fa-chart-bar"></i>
                                <p>Sommaire de compte</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="" class="nav-link">
                                <i class="fas fa-balance-scale"></i>
                                <p>Balance</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="" class="nav-link">
                                <i class="fas fa-sack-dollar"></i>
                                <p>Bilan</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="{{ route('tableau.tfr') }}" class="nav-link">
                                <i class="fas fa-poll"></i>
                                <p>TFR</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="{{ route('caisse.journal') }}" class="nav-link">
                                <i class="fas fa-book"></i>
                                <p>Journal</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="" class="nav-link">
                                <i class="fas fa-wallet"></i>
                                <p>Grand livre</p>
                            </a>
                        </li>


                    </ul>
                </li>


                <li class="nav-item">
                    <?php  if ($userInfo->chefcaisse == 1) {?>
                    <a href="#" class="nav-link">
                        <i class="fas fa-cog"></i>
                        <p>
                            Paramètres
                            <i class="fas fa-angle-left right"></i>
                        </p>
                    </a>
                    <?php }else {?>
                    <a href="#" class="nav-link disabledLink">
                        <i class="fas fa-cog"></i>
                        <p>
                            Paramètres
                            <i class="fas fa-angle-left right"></i>
                        </p>
                    </a>
                    <?php }?>
                    <?php if($userInfo->SuperRole==1 and $userInfo->level==2) {?>
                    <ul class="nav nav-treeview">
                        <li class="nav-item">
                            <a href="{{ route('utilisateurs.users') }}" class="nav-link">
                                <i class="fas fa-users"></i>
                                <p>Utlisateurs</p>
                            </a>
                        </li>
                        {{-- <li class="nav-item">
                                <a href="" class="nav-link">
                                    <i class="fas fa-laptop"></i>
                                    <p>Ordinateurs</p>
                                </a>
                            </li> --}}
                        {{-- <li class="nav-item">
                                <a href="" class="nav-link">
                                    <i class="fas fa-database"></i>
                                    <p>BDD Historique</p>
                                </a>
                            </li> --}}
                        {{-- <li class="nav-item">
                                <a href="" class="nav-link">
                                    <i class="fab fa-get-pocket"></i>
                                    <p>SQL</p>
                                </a>
                            </li> --}}
                    </ul>
                    <?php }?>
                </li>

                {{-- <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="fa-solid fa-cart-shopping"></i>
                        <p>
                            Gestion de stock
                            <i class="fas fa-angle-left right"></i>
                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        <li class="nav-item">
                            <a href="" class="nav-link">
                                <i class="fas fa-users"></i>
                                <p>Utlisateurs</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="" class="nav-link">
                                <i class="fas fa-laptop"></i>
                                <p>Ordinateurs</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="" class="nav-link">
                                <i class="fas fa-database"></i>
                                <p>BDD Historique</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="" class="nav-link">
                                <i class="fab fa-get-pocket"></i>
                                <p>SQL</p>
                            </a>
                        </li>
                    </ul>
                </li> --}}
                {{-- <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="nav-icon fas fa-table"></i>
                        <p>
                            Tables
                            <i class="fas fa-angle-left right"></i>
                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        <li class="nav-item">
                            <a href="pages/tables/simple.html" class="nav-link">
                                <i class="far fa-circle nav-icon"></i>
                                <p>Simple Tables</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="pages/tables/data.html" class="nav-link">
                                <i class="far fa-circle nav-icon"></i>
                                <p>DataTables</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="pages/tables/jsgrid.html" class="nav-link">
                                <i class="far fa-circle nav-icon"></i>
                                <p>jsGrid</p>
                            </a>
                        </li>
                    </ul>
                </li> --}}

                {{-- <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="nav-icon fas fa-circle"></i>
                        <p>
                            Level 1
                            <i class="right fas fa-angle-left"></i>
                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        <li class="nav-item">
                            <a href="#" class="nav-link">
                                <i class="far fa-circle nav-icon"></i>
                                <p>Level 2</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link">
                                <i class="far fa-circle nav-icon"></i>
                                <p>
                                    Level 2
                                    <i class="right fas fa-angle-left"></i>
                                </p>
                            </a>
                            <ul class="nav nav-treeview">
                                <li class="nav-item">
                                    <a href="#" class="nav-link">
                                        <i class="far fa-dot-circle nav-icon"></i>
                                        <p>Level 3</p>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a href="#" class="nav-link">
                                        <i class="far fa-dot-circle nav-icon"></i>
                                        <p>Level 3</p>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a href="#" class="nav-link">
                                        <i class="far fa-dot-circle nav-icon"></i>
                                        <p>Level 3</p>
                                    </a>
                                </li>
                            </ul>
                        </li>
                       
                    </ul>
                </li> --}}
            </ul>
            <?php }else if($userInfo->Role == 0){?>
            <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu"
                data-accordion="false">
                <li class="nav-item">
                    {{-- menu-open --}}
                    <a href="#" class="nav-link active">
                        <i class="fas fa-tasks"></i>
                        <p>
                            MENU
                            <i class="right fas fa-angle-left"></i>
                        </p>
                    </a>
                    <ul class="nav nav-treeview">

                        <li class="nav-item">
                            <a href="{{ route('membre.adhesion') }}" class="nav-link">
                                <i class="fas fa-users"></i>
                                <p>Adhésion</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="{{ route('membre.solde') }}" class="nav-link">
                                <i class="fas fa-money-bill"></i>
                                <p>Vérification solde</p>
                            </a>
                        </li>

                        <li class="nav-item">
                            <a href="{{ route('rapport.credit') }}" class="nav-link">
                                <i class="fas fa-eye"></i>
                                <p>Consulter</p>
                            </a>
                        </li>





                    </ul>
                    <?php }?>
        </nav>

    </div>

</aside>
<?php }?>
