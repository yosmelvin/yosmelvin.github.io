<?php

require_once '../vendor/swiftmailer/swiftmailer/lib/swift_required.php';

// Method: POST, PUT, GET etc
// Data: array("param" => "value") ==> index.php?param=value

function CallAPI($method, $url, $data = false)
{
    $curl = curl_init();

    switch ($method)
    {
        case "POST":
            curl_setopt($curl, CURLOPT_POST, 1);

            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            break;
        case "PUT":
            curl_setopt($curl, CURLOPT_PUT, 1);
            break;
        default:
            if ($data)
                $url = sprintf("%s?%s", $url, http_build_query($data));
    }

    // Optional Authentication:
    curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($curl, CURLOPT_USERPWD, "username:password");

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($curl);

    curl_close($curl);

    return $result;
}

//empty($_POST['recaptcha_response']) ||
// Check for empty fields
if(empty($_POST['name'])      ||
   empty($_POST['email'])     ||
   empty($_POST['phone'])     ||
   empty($_POST['message'])   ||
   
   !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))
   {
   echo "No arguments Provided!";
   return false;
   }

// $data['secret'] = '6LdvHRYUAAAAAKzD_WHdd8iE_wOKn8fsTXpUnXwL';
// $data['response'] = $_POST['recaptcha_response'];
// $data['ip'] = $_SERVER['REMOTE_ADDR'];
// $responseKeys = CallAPI('POST', 'https://www.google.com/recaptcha/api/siteverify', $data);

// if(intval($responseKeys["success"]) !== 1) {
//   echo 'You are spammer !';
// }

$name = strip_tags(htmlspecialchars($_POST['name']));
$email_address = strip_tags(htmlspecialchars($_POST['email']));
$phone = strip_tags(htmlspecialchars($_POST['phone']));
$message = strip_tags(htmlspecialchars($_POST['message']));


$from = $email_address;
$to = 'ymtsolution@gmail.com';
$subject = "Website Contact Form:  $name";
$body = "You have received a new message from your website contact form.\n\n"."Here are the details:\n\nName: $name\n\nEmail: $email_address\n\nPhone: $phone\n\nMessage:\n$message";
 
$transport = Swift_SmtpTransport::newInstance('smtp.gmail.com', 587, "tls")
  ->setUsername('endorsepin.noreply@gmail.com')
  ->setPassword('asdfasdf123');

$mailer = Swift_Mailer::newInstance($transport);

$message = Swift_Message::newInstance($subject)
  ->setFrom(array($from => $from))
  ->setTo(array($to))
  ->setBody($body);

$result = $mailer->send($message);

if (empty($result)) {
    echo('<p>' . 'error' . '</p>');
} else {
    echo('<p>Message successfully sent!</p>');
}

return true;
?>
