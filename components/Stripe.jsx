'use client'
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Confirm the SetupIntent with the client secret
    const result = await stripe.confirmCardSetup(clientSecret, {
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
      if (result.setupIntent.status === 'succeeded') {
        console.log('Setup successful!');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className='max-w-[586px]'>
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
  const [clientSecret, setClientSecret] = useState('');
  const [amount, setAmount] = useState(0); // Though it's 0, you might want to handle this dynamically.
  const [email, setEmail] = useState('test@gmail.com');

  useEffect(() => {
    fetch('https://app-admin-api-boshhh-prod-001.azurewebsites.net/api/Stripe/CreateSetupIntent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'text/plain'
      },
      body: JSON.stringify({ amount, email }), // Even though the amount is 0, include it if required by your backend.
    }).then(async (result) => {
      const data = await result.json();
      setClientSecret(data.clientSecret);
    });
  }, [amount, email]);

  return (
    <>
      <h1>React Stripe SetupIntent Example</h1>
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      )}
    </>
  );
};

export default PaymentPage;

