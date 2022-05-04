@yield('header')
@include('partials.sidebar')
<div class="content-wrapper">
    @yield('content-header')

    <section class="content">
    <div class="container-fluid">
        @yield('body')
    </div>
    </section>
    
    </div>
    @include('partials.footer')