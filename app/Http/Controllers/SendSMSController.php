<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\User;
use Twilio\Rest\Client;
use Illuminate\Http\Request;
// use Illuminate\Notifications\VonageChannelServiceProvider;
use Illuminate\Support\Facades\Auth;
use App\Notifications\TestSmsNotification;

class SendSMSController extends Controller
{

    public function sendSms(Request $request)
    {
        // $client = new Vonage\Client(new Vonage\Client\Credentials\Basic(API_KEY, API_SECRET));

        // $basic  = new \Vonage\Client\Credentials\Basic("a71c9569", "66hbiCl0AFKjk4mG");
        // $client = new \Vonage\Client($basic);

        // $response = $client->sms()->send(
        //     new \Vonage\SMS\Message\SMS("243976518324", BRAND_NAME, 'A text message sent using the Nexmo SMS API')
        // );

        // $message = $response->current();

        // if ($message->getStatus() == 0) {
        //     echo "The message was sent successfully\n";
        // } else {
        //     echo "The message failed with status: " . $message->getStatus() . "\n";
        // }

        try {
            $receiver_number = $request->number;
            $message = "Bonjour test";
            $account_sid = getenv("TWILIO_SID");
            $auth_token = getenv("TWILIO_TOKEN");
            $twilio_number = getenv("TWILIO_FROM");

            $client = new Client($account_sid, $auth_token);
            $client->messages->create($receiver_number, [
                'from' => $twilio_number,
                // "statusCallback" => 'http://postb.in/1234abcd',
                'body' => $message,

            ]);
            // return redirect()->back();
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function smsHomepage()
    {
        return view("send-sms");
    }
}
