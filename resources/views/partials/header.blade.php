<!DOCTYPE html>
<html lang="fr" moznomarginboxes mozdisallowselectionprint>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>ECONOMISONS | V3</title>
    <link rel="icon" href="{{ asset('dist/img/logom2.png') }}">
    <base href="/">


    {{-- <link rel="icon" type="{{ asset('') }}"
        href="{{ asset('dist/img/AdminLTELogo.png') }}"> --}}
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">

    <link rel="stylesheet" href="{{ asset('plugins/fontawesome-free/css/all.min.css') }}">

    <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">

    <link rel="stylesheet"
        href="{{ asset('plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css') }}">

    <link rel="stylesheet" href="{{ asset('plugins/icheck-bootstrap/icheck-bootstrap.min.css') }}">

    <link rel="stylesheet" href="{{ asset('plugins/jqvmap/jqvmap.min.css') }}">

    <link rel="stylesheet" href="{{ asset('dist/css/adminlte.min.css?v=3.2.0') }}">

    <link rel="stylesheet" href="{{ asset('plugins/overlayScrollbars/css/OverlayScrollbars.min.css') }}">

    <link rel="stylesheet" href="{{ asset('plugins/daterangepicker/daterangepicker.css') }}">

    <link rel="stylesheet" href="{{ asset('plugins/summernote/summernote-bs4.min.css') }}">

    <link rel="stylesheet" href="{{ asset('plugins/toastr/toastr.min.css') }}">
    <link rel="stylesheet" href="{{ asset('dist/css/adminlte.min.css') }}">
    <link rel="stylesheet" href="{{ asset('plugins/sweetalert2-theme-bootstrap-4/bootstrap-4.min.css') }}">
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <!-- DataTables -->
    <link rel="stylesheet" href="{{ asset('plugins/datatables-bs4/css/dataTables.bootstrap4.min.css') }}">
    <link rel="stylesheet" href="{{ asset('plugins/datatables-responsive/css/responsive.bootstrap4.min.css') }}">
    <link rel="stylesheet" href="{{ asset('plugins/datatables-buttons/css/buttons.bootstrap4.min.css') }}">
    {{-- <link rel="stylesheet" href="{{ asset('nav-menu/css/style.css') }}"> --}}
    <style>
        @media print {
            .table th {
                background-color: #DCDCDC !important;
            }

            /* table {
                background: #444;
                color: #fff;
                padding: 8px;
                margin: 3px;
                border: 2px solid #fff;
                text-align: center;
                width: 100%;
            }

            table tr,
            td {
                border: 2px solid #fff;
                padding: 2px;
            }

            table {
                background: #444;
                color: #fff;
                padding: 8px;
                margin: 3px;
                border: 2px solid #fff;
                text-align: center;
                width: 100%;
            }

            table tr,
            td {
                border: 2px solid #fff;
                padding: 2px;
            } */

        }

        @page {
            size: auto !important;
            margin: 0mm !important;
        }


        .tableStyle {
            background: #444;
            color: #fff;
            padding: 5px;
            margin: 3px;
            border: 2px solid #fff;
            text-align: left;
            width: 100%;
        }

        .tableStyle tr,
        td {
            border: 2px solid #fff;
            padding: 0px;
            font-size: 14px;
        }

        body {
            font-family: Tahoma, 'Times New Roman', 'Sans-Serif' !important;
        }
    </style>
</head>

<body class="hold-transition sidebar-mini layout-fixed">
    <div class="wrapper">

        <div class="preloader flex-column justify-content-center align-items-center">
            <img class="animation__shake" src="{{ asset('dist/img/AdminLTELogo.png') }}" alt="AdminLTELogo"
                height="60" width="60">
        </div>

        <nav class="main-header navbar navbar-expand navbar-white navbar-light"
            style="border-bottom: 4px solid #DCDCDC;margin-top:-25px;')">

            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i
                            class="fas fa-bars"></i></a>
                </li>
                <li class="nav-item d-none d-sm-inline-block">
                    <a href="home" class="nav-link">Home</a>
                </li>

            </ul>

            <!-- Right navbar links -->
            <ul class="navbar-nav ml-auto">
                <!-- Messages Dropdown Menu -->
                <li class="dropdown">
                    <h5 class="mt-1" style="font-family:calibri;font-weight: bold;">
                        {{ Auth::user()->name }} </h5>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-widget="fullscreen" href="#" role="button">
                        <i class="fas fa-expand-arrows-alt"></i>
                    </a>
                </li>

                <!-- Notifications Dropdown Menu -->
                <li class="dropdown" style="margin-left: 30px;">
                    <a style="font-size: 20px; color:inherit;" href="#" class="dropdown-toggle"
                        data-toggle="dropdown">
                        <img style="height: 30px;width: 30px;" src="{{ asset('dist/img/default.jpg') }}"
                            class="img-circle elevation-2" alt="User Image">
                        <!-- <span class="badge badge-warning navbar-badge">Detiny</span> -->
                    </a>
                    <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right ">
                        {{-- <a target="_blank" href="" class="dropdown-item" >
          <div class="media">
            <div class="media-body">
              <h3 class="dropdown-item-title">
              <i class="fas fa-user"></i> Mon profile
              </h3>
            </div>
          </div>
        </a><hr> --}}
                        <div class="mt-3 space-y-1">
                            <!-- Authentication -->
                            <a class="dropdown-item" href="{{ route('logout') }}"
                                onclick="event.preventDefault();
                        document.getElementById('logout-form').submit();">
                                {{ __('Logout') }}
                            </a>
                            <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                                @csrf
                            </form>
                        </div>
                    </div>
                </li>
            </ul>
        </nav>

        <?php
        use Illuminate\Support\Facades\DB;
        $userInfo = DB::select('SELECT * FROM users WHERE id="' . Auth::user()->id . '"')[0];
        $dateSaisie = DB::select('SELECT DateTaux FROM taux_journaliers ORDER BY id DESC LIMIT 1')[0];
        
        $checkIfClosedDay = DB::select('SELECT DateSysteme,closed FROM closed_days   ORDER BY id DESC LIMIT 1')[0];
        
        ?>

        <?php if($checkIfClosedDay->closed==0) {?>
        <?php 
        if($userInfo->Role == 1 and $userInfo->locked!=1) {?>

        <nav class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
            <div class="container">
                {{-- <a class="navbar-brand" href="home">ECONOMISONS</a> --}}
                {{-- <form action="#" class="searchform order-sm-start order-lg-last">
                    <div class="form-group d-flex">
                        <input type="text" class="form-control pl-3" placeholder="Search">
                        <button type="submit" placeholder="" class="form-control search"><span
                                class="fa fa-search"></span></button>
                    </div>
                </form> --}}
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav"
                    aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="fa fa-bars"></span> Menu
                </button>
                <div class="collapse navbar-collapse" id="ftco-nav">
                    <ul class="navbar-nav m-auto">
                        <li class="nav-item active"><a href="home" class="nav-link">Home</a></li>
                        <?php if($userInfo->caissier==1) {?>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="dropdown04"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Opération</a>
                            <div class="dropdown-menu" aria-labelledby="dropdown04">
                                <a class="dropdown-item" href="{{ route('depot.espece') }}">Dépot</a>
                                <a class="dropdown-item" href="{{ route('retrait.espece') }}">Rétrait</a>
                                <a class="dropdown-item"
                                    href="{{ route('retrait.positionnement') }}">Positionnement</a>

                                <a class="dropdown-item" href="{{ route('appro.approvisionnement') }}">Appro</a>
                                <a class="dropdown-item" href="{{ route('retour.delestage') }}">Délestage</a>
                                <a class="dropdown-item" href="{{ route('entree.tresor') }}">Entrée T</a>
                            </div>
                        </li>
                        <?php } ?>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="dropdown04"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Crédit</a>
                            <div class="dropdown-menu" aria-labelledby="dropdown04">
                                <a class="dropdown-item" href="{{ route('credit.suivi') }}">Montage crédit</a>
                                <a class="dropdown-item" href="{{ route('rapport.credit') }}">Rapport crédit</a>
                                {{-- <a class="dropdown-item" href="#">Page 3</a>
                                <a class="dropdown-item" href="#">Page 4</a> --}}
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="dropdown04"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Clientèle</a>
                            <div class="dropdown-menu" aria-labelledby="dropdown04">
                                <a class="dropdown-item" href="{{ route('membre.adhesion') }}">Adhésion membre</a>
                                <a class="dropdown-item" href="{{ route('membre.solde') }}">Rélevé de compte</a>
                                <a class="dropdown-item" href="{{ route('compte.sommaire') }}">Sommaire de compte</a>
                                {{-- <a class="dropdown-item" href="#">Page 3</a>
                                <a class="dropdown-item" href="#">Page 4</a> --}}
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="dropdown04"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Agents</a>
                            <div class="dropdown-menu" aria-labelledby="dropdown04">
                                <a class="dropdown-item" href="{{ route('payement.agent') }}">Payement agent</a>
                                <a class="dropdown-item" href="">Bulletin de paie</a>

                                {{-- <a class="dropdown-item" href="#">Page 3</a>
                                <a class="dropdown-item" href="#">Page 4</a> --}}
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="dropdown04"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Rapport</a>
                            <div class="dropdown-menu" aria-labelledby="dropdown04">
                                <a class="dropdown-item" href="{{ route('tableau.tfr') }}">TFR</a>


                                <a class="dropdown-item" href="{{ route('membre.solde') }}">Rélevé</a>
                                <a class="dropdown-item" href="{{ route('rapport.credit') }}">Rapport crédit</a>
                                <a class="dropdown-item" href="{{ route('caisse.journal') }}">Journal</a>
                                <a class="dropdown-item" href="{{ route('caisse.repertoire') }}">Repertoire C</a>
                                <a class="dropdown-item" href="{{ route('remboursement.attendu') }}">Remboursement
                                    attendu</a>
                                <a class="dropdown-item" href="{{ route('tableau.reports') }}">Autres rapports</a>
                                {{-- <a class="dropdown-item" href="#">Page 3</a>
                                <a class="dropdown-item" href="#">Page 4</a> --}}
                            </div>
                        </li>
                        {{-- <li class="nav-item"><a href="{{ route('depot.espece') }}" class="nav-link">Dépot</a></li>
                        <li class="nav-item"><a href="{{ route('retrait.positionnement') }}"
                                class="nav-link">Visa</a></li>
                        <li class="nav-item"><a href="{{ route('retrait.espece') }}" class="nav-link">Retrait</a>
                        </li> --}}
                        <li class="nav-item"><a href="{{ route('retour.delestage') }}"
                                class="nav-link">Délestage</a></li>
                        <li class="nav-item"><a href="{{ route('entree.tresor') }}" class="nav-link">Entrée T</a>
                        <li class="nav-item"><a href="{{ route('membre.solde') }}" class="nav-link">Solde</a>
                        </li>
                        <li class="nav-item"><a style="color:red" href="{{ route('remboursement.attendu') }}"
                                class="nav-link">Rembours. attendus</a>
                        </li>
                        <li class="nav-item"><a href="{{ route('sms.banking') }}" class="nav-link">SMS Banking</a>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
        <?php }?>
        <?php }else if($checkIfClosedDay->closed==1 and $userInfo->SuperRole != 1) {?>
        <div style="width: 250px;margin:0px auto">
            <p style="color: red;padding:5px;margin:3px;"> <strong>Cette jounée est déjà clôturée
                    <br>Vous devez ouvrir une nouvelle journée

                    <br>
                    Merci !
                </strong> </p>
        </div>
        <?php }?>


        <!-- END nav -->
