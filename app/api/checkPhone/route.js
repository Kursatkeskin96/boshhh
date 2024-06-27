import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone } = body;
    if (!phone) {
      return NextResponse.json(
        { message: "Phone is required" },
        { status: 400 }
      );
    }

    const { data } = await axios.get(
      `https://app-admin-api-boshhh-prod-001.azurewebsites.net/api/Registration/GetByMobile/${encodeURIComponent(
        phone
      )}`
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
