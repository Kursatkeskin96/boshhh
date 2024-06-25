import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const payload = await req.text();
    const sig = req.headers.get("Stripe-Signature");

    console.log("Received payload:", payload);
    console.log("Received signature:", sig);

    // Verify the event by checking the signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        payload,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Error verifying webhook signature:", err);
      return NextResponse.json({ status: "Failed", error: err.message });
    }

    console.log("Event verified:", event?.type);

    const res = JSON.parse(payload);
    const dateTime = new Date(res?.created * 1000).toLocaleDateString();
    const timeString = new Date(res?.created * 1000).toLocaleDateString();

    console.log(
      "Event details:",
      res?.data?.object?.billing_details?.email, // email
      res?.data?.object?.amount, // amount
      JSON.stringify(res), // payment info
      res?.type, // type
      String(timeString), // time
      String(dateTime), // date
      res?.data?.object?.receipt_email, // email
      res?.data?.object?.receipt_url, // url
      JSON.stringify(res?.data?.object?.payment_method_details), // Payment method details
      JSON.stringify(res?.data?.object?.billing_details), // Billing details
      res?.data?.object?.currency // Currency
    );

    return NextResponse.json({
      status: "success",
      event: event.type,
      response: res,
    });
  } catch (error) {
    console.error("Error processing webhook event:", error);
    return NextResponse.json({ status: "Failed", error: error.message });
  }
}
