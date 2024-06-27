import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  try {
    const body = await request.json();
    const { price } = body;
    if (!price) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const { data } = await axios.post(
      "https://app-admin-api-boshhh-prod-001.azurewebsites.net/api/Stripe/CreatePaymentIntentWithoutUser",
      {
        price,
      }
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
