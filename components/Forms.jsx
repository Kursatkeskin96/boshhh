"use client";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import FormikInput from "./formik/FormikInput";
import FormikSelect from "./formik/FormikSelect";
import Dropdown from "./Dropdown";
import { Icon_money, Icon_Credit } from "@/constants/icons";
import axios from "axios";
import { useDebounce } from "use-debounce";
import formValidationSchema from "@/constants/validation";
import CheckoutForm from "./StripeForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux";

const Forms = () => {
  const initialValues = {
    email: "",
    firstName: "",
    lastName: "",
    dob: "",
    telephoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postCode: "",
  };
  const stripePromise = loadStripe(
    "pk_live_51LzeVtE8CpEsx2nlq3iCBvWTKHxJUSEg7AskaQSpbqiCaZEjvDZss2rqFySF9ZfPKqa0RXfnTe8DPGwHSAsFxNQk000DcI5wzQ"
  );

  const [initialData, setInitialData] = useState();
  const [apiResponse, setApiResponse] = useState(null);
  const [apiTelephone, setApiTelephone] = useState(null);
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [debouncedEmail] = useDebounce(email, 500);
  const [debounceTelephone] = useDebounce(telephone, 500);
  const [stripeSecret, setStripeSecret] = useState();
  const { data: reduxData } = useSelector((state) => state.hiddenData);
  const [dataResponse, setDataResponse] = useState(null);
  const getDetails = async () => {
    let config = {
      method: "get",
      url: "https://boshhh.com/apps/register/dev/api/getPackages.php",
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.request(config);
      setInitialData(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  const sendMailFn = async () => {
    try {
      const { data } = await axios.post("api/fetchdata", {
        email: debouncedEmail,
      });
      setApiResponse(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const sendMailTel = async () => {
    try {
      const { data } = await axios.post("/api/checkPhone", {
        phone: debounceTelephone,
      });
      setApiTelephone(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (debouncedEmail) {
      sendMailFn();
    }
    if (debounceTelephone) {
      sendMailTel();
    }
  }, [debouncedEmail, debounceTelephone]);
  const options = initialData?.filter(({ Categoryid }) => Categoryid === 2);

  const handleSubmit = async (values) => {
    const response = await axios.post(
      "/api/createDeal",
      {
        title: "",
        firstName: values.firstName,
        lastName: values.lastName,
        dateOfBirth: values.dob,
        telephone: values.telephoneNumber,
        emailAddress: values.email,
        billingStreet1: values.addressLine1,
        billingLocality: "London",
        billingCounty: "Greater London",
        billingCity: "",
        billingPostcode: values.postCode,
        simPlan: reduxData?.name,
        simPlanId: reduxData?.id,
        registrationStage: "Bashh",
        buildingNo: "456",
        value: parseFloat(reduxData?.price),
        stageId: 98,
        paymentChargeId: "77777777777777777",
      },
      { withCredentials: true }
    );

    setDataResponse(response);
  };

  const stripeData = async () => {
    const { data } = await axios.post("/api/stripeApi", { price: "0.00" });
    setStripeSecret(data);
  };

  useEffect(() => {
    stripeData();
  }, []);

  const appearance = {
    theme: "stripe",
    labels: "floating",

    variables: {
      colorPrimary: "#000",
      colorBackground: "#ffffff",
      colorText: "#757575",
      colorDanger: "#dc2626",
      fontFamily: "Poppins, sans-serif",
      borderRadius: "5px",
      fontSizeBase: "14px",
    },
  };
  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={formValidationSchema({
        email: apiResponse,
        phone: apiTelephone,
      })}
    >
      {() => {
        return (
          <div className="sm:block lg:flex gap-7 lg:container mx-auto min-h-screen checkout-wrapper">
            <Form className="bg-white p-4 lg:pr-10 lg:w-[60%]">
              <div>
                <h4 className="font-black mb-3 text-black text-base">
                  Email Address
                </h4>
                <FormikInput
                  label="Email"
                  name="email"
                  required={true}
                  type="email"
                  onChange={(value) => setEmail(value)}
                />
              </div>
              <div className="pb-6">
                <h4 className="font-black mb-3 text-black text-base">
                  Delivery Method
                </h4>
                <div className="flex justify-between bg-[#f5f5f5] rounded-md mb-3 p-4 ">
                  <div className="flex items-center gap-2 ">
                    <input className="form-radio " type="radio" checked />
                    <span>Express</span>
                  </div>
                  <div>FREE</div>
                </div>
              </div>
              <div className="">
                <h4 className="font-black mb-3 text-black text-base">
                  Billing Address
                </h4>
                <div className="flex gap-2">
                  <FormikInput
                    label="First name"
                    name="firstName"
                    required={true}
                    type="text"
                  />
                  <FormikInput
                    label="Last name"
                    name="lastName"
                    required={true}
                    type="text"
                  />
                </div>

                <div className="flex gap-2">
                  <FormikInput
                    label="Date of birth (DD/MM/YYYY)"
                    name="dob"
                    required={true}
                    type="text"
                  />
                  <FormikInput
                    label="Telephone number"
                    name="telephoneNumber"
                    required={true}
                    type="number"
                    onChange={(value) => setTelephone(value)}
                  />
                </div>
                <div>
                  <FormikInput
                    label="Address Line 1"
                    name="addressLine1"
                    required={true}
                    type="text"
                  />
                  <FormikInput
                    label="Address Line 2"
                    name="addressLine2"
                    required={false}
                    type="text"
                  />
                </div>

                <div className="flex gap-2">
                  <FormikInput
                    label="City"
                    name="city"
                    required={true}
                    type="text"
                  />
                  <FormikInput
                    label="Post Code"
                    name="postCode"
                    required={true}
                    type="number"
                  />
                </div>

                {/* <button
                  className="bg-[#50d192] rounded-full p-3 w-full text-white"
                  type="submit"
                >
                  Submit
                </button> */}
              </div>

              <div>
                {stripeSecret && (
                  <Elements
                    options={{
                      clientSecret: stripeSecret?.clientSecret,
                      appearance: appearance,
                    }}
                    stripe={stripePromise}
                  >
                    <CheckoutForm
                      clientSecret={stripeSecret?.clientSecret}
                      dataResponse={dataResponse}
                    />
                  </Elements>
                )}
              </div>
            </Form>

            <div className=" lg:w-[40%] pt-10 px-4">
              {options && <Dropdown options={options} />}

              <div className="flex justify-between border-t border-b border-t-[#d0d5dd]  border-b-[#d0d5dd] mt-5 py-4 text-[18px] font-bold ">
                <span className="">Total</span>
                <span className="flex gap-1">
                  <s className="">£{reduxData?.price}</s>£0.00
                </span>
              </div>

              <div className="flex gap-2  py-2 pt-5 text-[14px] leading-5 font-medium">
                <div>
                  <Icon_Credit />
                </div>
                <div>
                  Pay for your first month when you activate your SIM via our
                  mobile app
                </div>
              </div>
              <div className="flex items-center gap-2 py-2  text-[14px] leading-5 font-medium">
                <div>
                  <Icon_money />
                </div>
                <div>14 day money back guarantee after SIM activation</div>
              </div>
            </div>
          </div>
        );
      }}
    </Formik>
  );
};

export default Forms;
