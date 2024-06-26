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
    <div className='max-w-[586px] flex justify-center items-center mx-auto'>
        <form onSubmit={handleSubmit} >
      {clientSecret && (
         <label>
         Email
         <input
           type="email"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
         />
       </label>
      )}
      <PaymentElement />
      {clientSecret && (
              <button type="submit" disabled={!stripe} className='bg-[#1E1E1E] text-center flex justify-center items-center   w-[90%] lg:w-[526px] h-[40px] py-15 pl-32 pr-24 mt-6 font-normal text-white rounded-[100px]" '>
              Pay
            </button>
      )}
    </form>
    </div>
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
    {clientSecret &&  (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm />
      </Elements>
    )}
  </>
  );
};

export default PaymentPage;