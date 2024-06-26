'use client'
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

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
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 border border-gray-300 rounded-lg shadow-md">
    <label className="block mb-2 font-bold">
      Email
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="block w-full mt-1 p-2 border border-gray-300 rounded-lg"
      />
    </label>
    <PaymentElement />
    <button type="submit" disabled={!stripe} className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400 mt-4">
      Save Payment Method
    </button>
  </form>
  );
};

const PaymentPage = () => {
  const [clientSecret, setClientSecret] = useState('');
  useEffect(() => {
    const createSetupIntent = async () => {
      const response = await fetch('https://app-admin-api-boshhh-prod-001.azurewebsites.net/api/Stripe/CreateSetupIntent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'text/plain'
        },
        body: JSON.stringify({ email: 'test@example.com' })  // Adjust the request payload as needed
      });

      const data = await response.json();
      setClientSecret(data.clientSecret);
    };

    createSetupIntent();
  }, []);
  return (
    <div>
    {clientSecret ? (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm clientSecret={clientSecret} />
      </Elements>
    ) : (
      <div>Loading...</div>
    )}
  </div>
  );
};

export default PaymentPage;