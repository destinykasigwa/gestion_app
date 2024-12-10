@extends('layouts.main-layout');
@include('partials.header');
@section('content-header')
    <div class="content-header">
        <div class="container-fluid">
            <h2 class="font-weight-bold">PEPORTS</h2>
        </div>
    @endsection
    @section('body')
        <div class="row">
            <div class="container-fluid">
                <!-- /.card -->

                <div class="row">

                    <div class="card-header">
                        <h3 class="card-title">
                        </h3>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            @include('partials.header-reports')
                            <form method="POST" action="reports">


                                @if (isset($success) and $success == 1)
                                    {{-- <div class="btn btn-success" style="border-radius: 0px">
                                        Resultat trouvé
                                    </div> --}}
                                @elseif(isset($success) and $success == 0)
                                    <div class="btn btn-danger" style="border-radius: 0px">
                                        Pas de données trouvé
                                    </div>
                                @endif
                                @csrf
                                <table>
                                    <tr>
                                        <td> <label for="input1" style="color: steelblue;font-weight:bold;">Date
                                                début </label>
                                        </td>
                                        <td> <input type="date" name="dateDebut" class="mt-2"
                                                style="box-shadow:inset 0 0 5px 5px #888;
                                                font-size:16px;border:0px;height:30px">
                                        </td>

                                    </tr>
                                    <tr>
                                        <td> <label for="input1" style="color: steelblue;font-weight:bold;">Date
                                                fin</label>
                                        </td>
                                        <td> <input type="date" name="dateFin" class="mt-1"
                                                style="box-shadow:inset 0 0 5px 5px #888;
                                                font-size:16px;border:0px;height:30px">
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td> <button class="btn btn-primary mt-1"
                                                style="border-radius: 0px">Extraire</button>
                                            {{-- <button type="button" class="btn btn-success toastrDefaultSuccess">
                                                    Launch Success Toast
                                                </button> --}}
                                        </td>
                                    </tr>
                                </table>
                            </form>
                            @if (isset($data))
                                <h3>
                                    Rapport des crédits octroyés
                                </h3>

                                <table id="example1" class="table table-bordered table-striped">
                                    <thead>

                                        <tr>
                                            <th>Num dossier</th>
                                            <th>Date Dmnde</th>
                                            <th>Date Oct</th>
                                            <th>Date Echnce</th>
                                            <th>Date Tranche</th>
                                            <th>Compte Ep</th>
                                            <th>Compte Crédit</th>
                                            <th>Intitulé c</th>
                                            <th>Durée</th>
                                            <th>M. dmndé</th>
                                            <th>M. Accordé</th>
                                            <th>Taux int.</th>
                                            <th>Cap Rembours.</th>
                                            <th>Cap Restant</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        @foreach ($data as $data)
                                            <tr>
                                                <td>{{ $data->NumDossier }}</td>
                                                <td>{{ $data->DateDemande }}</td>
                                                <td>{{ $data->DateOctroi }}</td>
                                                <td>{{ $data->DateEcheance }}</td>
                                                <td>{{ $data->DateTranche }}</td>
                                                <td>{{ $data->NumCompteEpargne }}</td>
                                                <td>{{ $data->NumCompteCredit }}</td>
                                                <td>{{ $data->NomCompte }}</td>
                                                <td>{{ $data->Duree }}</td>
                                                <td>{{ $data->MontantDemande }}</td>
                                                <td>{{ $data->MontantAccorde }}</td>
                                                <td>{{ $data->TauxInteret }}</td>
                                                <td>{{ $data->RemboursCapital }}</td>
                                                <td>{{ $data->CapitalRestant }}</td>

                                            </tr>
                                        @endforeach

                                    </tbody>

                                </table>
                            @endif

                        </div>
                        <!-- /.card-body -->
                    </div>



                </div>
                <!-- /.card -->

            </div>
        </div>
    @endsection
