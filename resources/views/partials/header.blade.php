<!DOCTYPE html>
<html lang="fr" moznomarginboxes mozdisallowselectionprint>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>ECONOMISONS | Dashboard</title>
    <base href="/">
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

    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <!-- DataTables -->
    <link rel="stylesheet" href="{{ asset('plugins/datatables-bs4/css/dataTables.bootstrap4.min.css') }}">
    <link rel="stylesheet" href="{{ asset('plugins/datatables-responsive/css/responsive.bootstrap4.min.css') }}">
    <link rel="stylesheet" href="{{ asset('plugins/datatables-buttons/css/buttons.bootstrap4.min.css') }}">

    <style>
        @media print {
            .table th {
                background-color: #DCDCDC !important;
            }

        }

        @page {
            size: auto;
            margin: 0mm;
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
                    <a href="index3.html" class="nav-link">Home</a>
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
                        <img style="height: 30px;width: 30px;" src="{{ asset('dist/img/user2-160x160.jpg') }}"
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
