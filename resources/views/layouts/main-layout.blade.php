<?php
use Illuminate\Support\Facades\DB;
?>
@yield('header')
@include('partials.sidebar')
<div class="content-wrapper"
    style="background-image: url('{{ asset('dist/img/image_epargne.jpg') }}');background-color: #343A40; background-position: center; background-repeat: no-repeat; background-size: cover;">
    @yield('content-header')

    <section class="content" style="background: #fff">
        <div class="container-fluid">
            <h6 class="text-center"
                style="border-radius: 50px;
            background: #e0e0e0;
            box-shadow:  20px 20px 60px #bebebe,
                         -20px -20px 60px #ffffff;">
                <?php
                $userInfo = DB::select('SELECT * FROM users WHERE id="' . Auth::user()->id . '"')[0];
                $dateSaisie = DB::select('SELECT DateTaux FROM taux_journaliers ORDER BY id DESC LIMIT 1')[0];
                $dataDuJour = date_create($dateSaisie->DateTaux);
                if ($userInfo->Role == 1) {
                    echo ' Date de Saisie : ' . date_format($dataDuJour, 'd/m/Y');
                } ?> </h6>
            @yield('body')
        </div>
    </section>

</div>
@include('partials.footer')
