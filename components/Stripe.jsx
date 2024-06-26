'use client'
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState(0);
  const [clientSecret, setClientSecret] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Call your backend to create a PaymentIntent
    const response = await fetch('https://app-admin-api-boshhh-prod-001.azurewebsites.net/api/Stripe/CreatePaymentIntent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'text/plain'
      },
      body: JSON.stringify({ amount, email })
    });

    const data = await response.json();
    setClientSecret(data.clientSecret);

    if (!stripe || !elements) {
      return;
    }

    // Confirm the PaymentIntent with the client secret
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          email: email,
        },
      },
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        console.log('Payment successful!');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <PaymentElement />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

const PaymentPage = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(0)
  const [email, SetEmail] = useState('test@gmail.com')

  useEffect(() => {
    fetch('https://app-admin-api-boshhh-prod-001.azurewebsites.net/api/Stripe/CreatePaymentIntent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'text/plain'
      },
      body: JSON.stringify({ amount, email }),
    }).then(async (result) => {
      var { clientSecret } = await result.json();
      setClientSecret(clientSecret);
    });
  }, []);
  
  return (
    <>
    <h1>React Stripe and the Payment Element</h1>
    {clientSecret &&  (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm />
      </Elements>
    )}
  </>
  );
};

export default PaymentPage;