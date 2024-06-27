import React from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useDispatch } from "react-redux";
import { setHandleSubmit } from "@/app/store/slices/submitSlice";
import { useFormikContext } from "formik";

export default function CheckoutForm({ clientSecret, dataResponse }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const paymentElementOptions = {
    layout: "tabs",

    fields: {
      billingDetails: {
        address: {
          country: "never", // Hide the country field
        },
      },
    },
  };

  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    if (!clientSecret) {
      return;
    }
  }, [stripe]);

  const confirmIntent = async (planPrice) => {
    if (planPrice <= 0) {
      const { error } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: "http://localhost:3000",
          payment_method_data: {
            billing_details: {
              address: {
                country: "GB",
              },
            },
          },
        },
      });
    } else {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: "http://localhost:3000",
          payment_method_data: {
            billing_details: {
              address: {
                country: "GB",
              },
            },
          },
        },
      });
    }
  };

  const handleClick = async () => {
    if (dataResponse?.status === 200) {
      if (!stripe || !elements) {
        // Stripe.js hasn't yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }
      setIsLoading(true);
      console.log("All inputs are valid.");
      confirmIntent(0.0);
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`. For some payment methods like iDEAL, your customer will
      // be redirected to an intermediate site first to authorize the payment, then
      // redirected to the `return_url`.
      // if (error.type === "card_error" || error.type === "validation_error") {
      //   setMessage(error.message);
      // } else {
      //   setMessage("An unexpected error occurred.");
      // }
      setIsLoading(false);
    }
  };

  return (
    // <form id="payment-form" onSubmit={handleSubmit}>
    <>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button
        className="bg-[#50d192] mt-2 rounded-full p-3 w-full text-white"
        // disabled={isLoading || !stripe || !elements}
        id="submit"
        onClick={handleClick}
      >
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </>

    // </form>
  );
}
