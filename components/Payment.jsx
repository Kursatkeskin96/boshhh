'use client'
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import CheckOutForm from './Stripe'
import CheckoutForm from './Stripe';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {
    const stripe = useStripe();
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