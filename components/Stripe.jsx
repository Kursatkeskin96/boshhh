'use client'
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';
import { Elements, PaymentElement, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const emailFromQuery = router.query.email ? decodeURIComponent(router.query.email) : '';
  const formattedEmail = emailFromQuery.replace(/%40/g, '@');
  const [email, setEmail] = useState(formattedEmail || ''); 
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
    <div className='max-w-[526px] flex justify-center items-center mx-auto'>
        <form onSubmit={handleSubmit} className='w-[100%]'>
      <div className='flex flex-col'>
      <label className='text-sm'>
        Email
        </label>
        <input
          type="email"
          value={email}
          placeholder='steven@gmail.com'
          className='focus:border-[#0048ff] px-[12px] mb-4 focus:ring-0 focus:outline-none placeholder-customGray w-full h-[40px] rounded-[5px] border-[1px] border-[#DADCE0] mx-auto'
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <PaymentElement />
      <button type="submit" disabled={!stripe} className='bg-[#1E1E1E] text-center flex justify-center items-center w-[100%] max-w-[526px] h-[40px] py-15 pl-32 pr-24 mt-6 font-normal text-white rounded-xl'>
        Pay
      </button>
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