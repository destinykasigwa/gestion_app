@extends('layouts.main-layout');
@include('partials.header');
@section('content-header')
    <div class="content-header">
        <div class="container-fluid">
            <h2 class="font-weight-bold">Remboursements attendus</h2>
        </div>
    @endsection
    @section('body')
        <div class="row">
            <div class="container-fluid" id="remboursementAttenduContainer">


            </div>
        </div>
    @endsection
