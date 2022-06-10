<?php
use Illuminate\Support\Facades\DB;
?>
@yield('header')
@include('partials.sidebar')
<div class="content-wrapper">
    @yield('content-header')

    <section class="content">
        <div class="container-fluid">
            <h6 class="text-center">Date de Saisie : <?php $dateSaisie = DB::select('SELECT DateTaux FROM taux_journaliers ORDER BY id DESC LIMIT 1')[0];
            $dataDuJour = date_create($dateSaisie->DateTaux);
            echo date_format($dataDuJour, 'd/m/Y'); ?> </h6>
            @yield('body')
        </div>
    </section>

</div>
@include('partials.footer')
