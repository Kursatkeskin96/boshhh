'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

const CheckoutForm = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: 'https://your-website.com/setup-confirmation',
        payment_method_data: {
          billing_details: {
            email: email,
          },
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

export default CheckoutForm;
