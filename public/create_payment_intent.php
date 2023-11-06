<?php

require_once '../vendor/autoload.php';

// Protect your PayRex Secret API key at all costs. One common approach
// to store it in an environment variable.
// Add your PayRex test secret API key.
$payrexSecretApiKey = '';

$payrex = new \Payrex\PayrexClient($payrexSecretApiKey);

// Create a PaymentIntent with amount and currency
$paymentIntent = $payrex->paymentIntents->create([
  // Amount is in cents. The sample below is 100.00.
  'amount' => 10000,
  'currency' => 'PHP',
  'payment_methods' => [
      'card',
      'gcash'
  ],
]);

$output = [
  'clientSecret' => $paymentIntent->client_secret,
];

echo json_encode($output);