// Add your PayRex Public API key.
const payrex = window.Payrex('');
let elements;

initialize();
checkPaymentIntentStatus();

async function payAction() {
  showLoading(true)
  await payrex.attachPaymentMethod({
    elements,
    options: {
      // Return URL is where the customer will be redirected after completing a payment.
      return_url: "http://localhost:4242/checkout.html",
    },
  });
  showLoading(false)
}

function showLoading(flag) {
  const btnPayText = document.querySelector("#btn-pay-text");
  const spinner = document.querySelector("#spinner");

  if (flag) {
    // Disable the button and show a spinner
    spinner.classList.remove("hidden");
    btnPayText.classList.add("hidden");
  } else {
    spinner.classList.add("hidden");
    btnPayText.classList.remove("hidden");
  }
}

async function initialize() {
  const {clientSecret} = await fetch(
    "/create_payment_intent.php",
    {
      method: "POST",
    }
  ).then((r) => r.json());
  
  elements = payrex.elements({
    clientSecret
  });

  const paymentElementOptions = {
    layout: "accordion",
  };

  const paymentElement = elements.create(
    "payment",
    paymentElementOptions
  );

  paymentElement.mount("#payment-element");
}

// Fetches the payment intent status after payment submission
async function checkPaymentIntentStatus() {
  const clientSecret = new URLSearchParams(window.location.search).get(
    "payment_intent_client_secret"
  );

  if (!clientSecret) {
    return;
  }

  const paymentIntent = await payrex.getPaymentIntent(clientSecret);

  switch (paymentIntent.status) {
    case "succeeded":
      window.alert("Payment succeeded.")
      break;
    case "processing":
      window.alert("Payment is still being processed.")
      break;
    case "awaiting_payment_method":
      window.alert("Payment was not successful. Try again..")

      break;
    default:
      window.alert("Something went wrong")

      break;
  }
}