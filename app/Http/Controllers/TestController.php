<?php

namespace App\Http\Controllers;

use App\Mail\TestMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class TestController extends Controller
{


    public function bar()
    {
        $user = Auth::user();
        $data = "ceci est d'autre données";
        Mail::to($user)->send(new TestMail($user, $data));
        return view('emails.test');
    }
}
