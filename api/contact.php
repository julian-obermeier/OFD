<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, array $data): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') respond(405, ['ok'=>false,'message'=>'Methode nicht erlaubt.']);

$configFile=__DIR__.'/contact-config.php';
if (!is_file($configFile)) respond(503, ['ok'=>false,'message'=>'Die Kontaktstelle ist noch nicht konfiguriert.']);
$config=require $configFile;
$recipient=trim((string)($config['recipient'] ?? ''));
$from=trim((string)($config['from'] ?? ''));
if (!filter_var($recipient,FILTER_VALIDATE_EMAIL)||!filter_var($from,FILTER_VALIDATE_EMAIL)) {
    respond(503,['ok'=>false,'message'=>'Die Kontaktstelle ist noch nicht vollständig konfiguriert.']);
}

$contentType=$_SERVER['CONTENT_TYPE'] ?? '';
if (str_contains($contentType,'application/json')) {
    $payload=json_decode((string)file_get_contents('php://input'),true);
    if (!is_array($payload)) $payload=[];
} else {
    $payload=$_POST;
}
if (!empty($payload['website'] ?? '')) respond(200,['ok'=>true,'message'=>'Vielen Dank.']);
$started=(int)($payload['started_at'] ?? 0);
if ($started<=0 || time()-$started<3 || time()-$started>86400) respond(422,['ok'=>false,'message'=>'Bitte laden Sie das Formular neu und versuchen Sie es erneut.']);

$ip=$_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile=sys_get_temp_dir().'/ofd-contact-'.hash('sha256',$ip);
$now=time();$hits=[];
if (is_file($rateFile)) {
    $decoded=json_decode((string)file_get_contents($rateFile),true);
    if (is_array($decoded)) $hits=array_values(array_filter($decoded,fn($t)=>is_int($t)&&$t>$now-3600));
}
if (count($hits)>=5) respond(429,['ok'=>false,'message'=>'Zu viele Anfragen. Bitte versuchen Sie es später erneut.']);
$hits[]=$now;@file_put_contents($rateFile,json_encode($hits),LOCK_EX);

$name=trim((string)($payload['name'] ?? ''));
$email=trim((string)($payload['email'] ?? ''));
$topic=trim((string)($payload['topic'] ?? ''));
$region=trim((string)($payload['region'] ?? ''));
$message=trim((string)($payload['message'] ?? ''));
$consent=($payload['consent'] ?? '')==='yes';
if (mb_strlen($name)<2||mb_strlen($name)>120) respond(422,['ok'=>false,'message'=>'Bitte geben Sie einen gültigen Namen ein.']);
if (!filter_var($email,FILTER_VALIDATE_EMAIL)||strlen($email)>190) respond(422,['ok'=>false,'message'=>'Bitte geben Sie eine gültige E-Mail-Adresse ein.']);
if (mb_strlen($topic)<2||mb_strlen($topic)>120||mb_strlen($region)>120) respond(422,['ok'=>false,'message'=>'Bitte prüfen Sie Thema und Region.']);
if (mb_strlen($message)<10||mb_strlen($message)>5000) respond(422,['ok'=>false,'message'=>'Die Nachricht muss zwischen 10 und 5.000 Zeichen enthalten.']);
if (!$consent) respond(422,['ok'=>false,'message'=>'Die Einwilligung zur Verarbeitung ist erforderlich.']);

$safeName=str_replace(["\r","\n"],' ',$name);
$safeEmail=str_replace(["\r","\n"],' ',$email);
$safeTopic=str_replace(["\r","\n"],' ',$topic);
$subject='OfD-Kontaktanfrage: '.$safeTopic;
$body="Neue Anfrage über die OfD-Website\n\nName: {$safeName}\nE-Mail: {$safeEmail}\nThema: {$safeTopic}\nRegion: {$region}\nZeitpunkt: ".date('c')."\nEinwilligung: erteilt\n\nNachricht:\n{$message}\n";
$headers=[
    'From: OfD Website <'.$from.'>',
    'Reply-To: '.$safeName.' <'.$safeEmail.'>',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/'.PHP_VERSION
];
$sent=@mail($recipient,'=?UTF-8?B?'.base64_encode($subject).'?=',$body,implode("\r\n",$headers));
if (!$sent) respond(500,['ok'=>false,'message'=>'Die Nachricht konnte derzeit nicht versendet werden.']);
respond(200,['ok'=>true,'message'=>'Vielen Dank. Ihre Nachricht wurde erfolgreich übermittelt.']);
