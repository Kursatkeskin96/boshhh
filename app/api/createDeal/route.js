import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      firstName,
      lastName,
      dateOfBirth,
      telephone,
      emailAddress,
      billingStreet1,
      billingLocality,
      billingCounty,
      billingCity,
      billingPostcode,
      simPlan,
      simPlanId,
      registrationStage,
      buildingNo,
      value,
      stageId,
      paymentChargeId,
    } = body;

    const { data } = await axios.post(
      "https://app-admin-api-boshhh-prod-001.azurewebsites.net/api/PipeDrive/AddDeal",
      {
        title,
        firstName,
        lastName,
        dateOfBirth,
        telephone,
        emailAddress,
        billingStreet1,
        billingLocality,
        billingCounty,
        billingCity,
        billingPostcode,
        simPlan,
        simPlanId,
        registrationStage,
        buildingNo,
        value,
        stageId,
        paymentChargeId,
      }
    );

    return NextResponse.json({
      data,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
