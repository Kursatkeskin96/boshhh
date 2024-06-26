'use client';
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const appearance = {
  theme: 'flat',
  variables: {
    fontFamily: '"Gill Sans", sans-serif',
    fontLineHeight: '1.5',
    borderRadius: '10px',
    colorBackground: '#F6F8FA',
    accessibleColorOnColorPrimary: '#262626'
  },
  rules: {
    '.Block': {
      backgroundColor: 'var(--colorBackground)',
      boxShadow: 'none',
      padding: '12px'
    },
    '.Input': {
      padding: '12px'
    },
    '.Input:disabled, .Input--invalid:disabled': {
      color: 'lightgray'
    },
    '.Tab': {
      padding: '10px 12px 8px 12px',
      border: 'none'
    },
    '.Tab:hover': {
      border: 'none',
      boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)'
    },
    '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
      border: 'none',
      backgroundColor: '#fff',
      boxShadow: '0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)'
    },
    '.Label': {
      fontWeight: '500'
    }
  }
};

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
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Save Card
      </button>
    </form>
  );
};

const PaymentPage = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [amount, setAmount] = useState(0); // Though it's 0, you might want to handle this dynamically.
  const [email, setEmail] = useState('test@gmail.com');

  useEffect(() => {
    const fetchSetupIntent = async () => {
      try {
        const response = await fetch('https://app-admin-api-boshhh-prod-001.azurewebsites.net/api/Stripe/CreateSetupIntent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'accept': 'text/plain'
          },
          body: JSON.stringify({ amount, email }), // Even though the amount is 0, include it if required by your backend.
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error fetching setup intent:', error);
      }
    };

    fetchSetupIntent();
  }, [amount, email]);

  return (
    <>
      <h1>React Stripe SetupIntent Example</h1>
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      )}
    </>
  );
};

export default PaymentPage;
