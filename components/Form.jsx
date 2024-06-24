"use client";
import React, { useState, useRef, useEffect } from "react";
import { CiMail } from "react-icons/ci";
import { MdLocalPhone } from "react-icons/md";

export default function Form(props) {
  const [isPostcodeValid, setIsPostcodeValid] = useState(false);
  const [postcode, setPostcode] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState({
    day: "",
    month: "",
    year: "",
  });
  const [selectedAddress, setSelectedAddress] = useState({
    line1: "",
    line2: "",
  });

  const dayRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropDownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSearchClick = async () => {
    try {
      const response = await fetch(
        `https://app-admin-api-boshhh-prod-001.azurewebsites.net/api/AddressLookUp/GetAddress?postCode=${postcode}`,
        {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch address");
      }

      const fetchedData = await response.json();

      if (Array.isArray(fetchedData.thoroughfares)) {
        const formattedAddresses = fetchedData.thoroughfares.map(
          (thoroughfare) => {
            return {
              line1: thoroughfare.name,
              line2: `${fetchedData.town} - ${fetchedData.county}`,
            };
          }
        );

        setAddresses(formattedAddresses);
        setIsPostcodeValid(true);
        setIsDropDownOpen(true);
      } else {
        console.error("Unexpected response format:", fetchedData);
        setAddresses([]);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setAddresses([]);
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropDownOpen(false);
    setIsPostcodeValid(true); // Hide dropdown after selecting an address
  };

  const handleFirstName = (e) => {
    setFirstname(e.target.value);
  };

  const handleLastName = (e) => {
    setLastname(e.target.value);
  };

  const handleDayInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= 2) {
      if (value > 31) {
        e.target.value = "";
      } else {
        setDateOfBirth((prev) => ({ ...prev, day: value }));
        if (value.length === 2) {
          monthRef.current.focus();
        }
      }
    } else {
      e.target.value = value.slice(0, 2);
    }
  };

  const handleMonthInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= 2) {
      if (value > 12) {
        e.target.value = "";
      } else {
        setDateOfBirth((prev) => ({ ...prev, month: value }));
        if (value.length === 2) {
          yearRef.current.focus();
        }
      }
    } else {
      e.target.value = value.slice(0, 2);
    }
  };

  const handleYearInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= 4) {
      setDateOfBirth((prev) => ({ ...prev, year: value }));
    } else {
      e.target.value = value.slice(0, 4);
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(validateEmail(value));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handlePhoneInputChange = (e) => {
    let value = e.target.value;

    if (!/^07/.test(value) && /^\d{2}/.test(value)) {
      value = '';
    }
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    e.target.value = value;
    setPhone(value);
  };

  const handleAddressChange = (e) => {
    const { id, value } = e.target;
    setSelectedAddress((prev) => ({ ...prev, [id]: value }));
  };

  const formattedDateOfBirth = `${dateOfBirth.day.padStart(
    2,
    "0"
  )}/${dateOfBirth.month.padStart(2, "0")}/${dateOfBirth.year}`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      title: "Mr",
      firstName: firstname,
      lastName: lastname,
      dateOfBirth: formattedDateOfBirth,
      telephone: phone,
      emailAddress: email,
      billingStreet1: selectedAddress.line1 || "390 BELLSHILL ROAD",
      billingLocality: "",
      billingCounty: selectedAddress.line2.split(' - ')[1] || "LANARKSHIRE",
      billingCity: selectedAddress.line2.split(' - ')[0] || "MOTHERWELL",
      billingPostcode: postcode || "ML13SR",
      simPlanId: "acc11e05-aa1f-4281-8c11-33746feaacca",
      paymentAmount: 23.99,
    };

    try {
      const response = await fetch(
        "https://app-admin-api-boshhh-prod-001.azurewebsites.net/api/PipeDrive/AddDeal",
        {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json-patch+json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateURLParams = () => {
    const url = new URL(window.location);
    const params = {};
  
    const addParam = (key, value) => {
      if (value) {
        params[key] = encodeURIComponent(value);
      }
    };
  
    addParam("checkout[shipping_address][first_name]", firstname);
    addParam("checkout[shipping_address][last_name]", lastname);
    addParam("checkout[email]", email);
    addParam("checkout[shipping_address][postcode]", postcode);
    addParam("checkout[shipping_address][address1]", selectedAddress.line1);
    addParam("checkout[shipping_address][city]", selectedAddress.line2.split(' - ')[0]);
  
    let queryString = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');
  
    // Replace encoded '@' with '@' for readability
    queryString = queryString.replace(/%40/g, '@');
  
    const newUrl = `${url.origin}${url.pathname}?${queryString}`;
    window.history.replaceState({}, '', newUrl);
  };
  
  useEffect(() => {
    updateURLParams();
  }, [firstname, lastname, email, postcode, selectedAddress]);
  
  return (
    <div className="flex justify-center items-center flex-col max-w-[586px] h-fit mx-auto">
      <form
        className="flex flex-col justify-center items-center"
        onSubmit={handleSubmit}
      >
           <div className="flex flex-col gap-2 px-5 md:flex-row justify-center items-center w-full lg:max-w-[526px] mx-auto">
          <div className="flex flex-col w-full justify-center items-center">
            <div className="w-[100%] lg:w-[250px] flex flex-col items-start">
              <label
                htmlFor="firstname"
                className="text-[#5F6368] text-[15px] font-normal"
              >
                First name *{" "}
              </label>
              <input
                type="text"
                id="firstname"
                onChange={handleFirstName}
                value={firstname}
                required
                placeholder="David"
                className=" w-[100%] focus:border-[#0048ff] focus:ring-0 focus:outline-none pl-2 h-[40px] rounded-[8px] border-[1px] border-[#DADCE0] placeholder-customGray"
              />
            </div>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <div className="w-[100%] lg:w-[250px] flex flex-col items-start">
              <label
                htmlFor="lastname"
                className="text-[#5F6368] text-[15px] font-normal"
              >
                Last name *{" "}
              </label>
              <input
                type="text"
                id="lastname"
                onChange={handleLastName}
                value={lastname}
                required
                placeholder="Smith"
                className="w-full pl-2 h-[40px] focus:border-[#0048ff] focus:ring-0 focus:outline-none rounded-[8px] border-[1px] border-[#DADCE0] placeholder-customGray"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col max-w-[526px] mt-4 mb-4 w-full mx-auto">
          <label
            htmlFor="contact-email"
            className="text-[#5F6368] text-[15px] font-normal self-start w-[90%] lg:w-full mx-auto"
          >
            Contact *{" "}
          </label>
          <div className="w-full lg:w-full flex flex-col items-center mx-auto">
            <div className="relative w-[90%] lg:w-full flex justify-center">
              <CiMail className="absolute text-[#80868B] top-[50%] text-xl left-[10px] translate-y-[-50%] pointer-events-none" />
              <input
                required
                className={`pl-10 focus:border-[#0048ff] focus:ring-0 focus:outline-none w-full placeholder-customGray h-[40px] rounded-[8px] border-[1px] ${
                  isEmailValid ? "border-[#DADCE0]" : "border-red-500"
                } mx-auto`}
                type="email"
                id="contact-email"
                onChange={handleEmailChange}
                value={email}
                placeholder="Your email"
                {...props}
              />
            </div>

            <div className="relative w-[90%] lg:w-full flex justify-center mt-4">
              <MdLocalPhone className="absolute text-[#80868B] top-[50%] text-xl left-[10px] translate-y-[-50%] pointer-events-none" />
              <input
                className="pl-10 focus:border-[#0048ff] focus:ring-0 focus:outline-none placeholder-customGray w-full h-[40px] rounded-[8px] border-[1px] border-[#DADCE0] mx-auto"
                type="number"
                required
                id="contact-phone"
                onChange={handlePhoneInputChange}
                value={phone}
                placeholder="07507 440705"
                {...props}
              />
            </div>
          </div>
        </div>

        <div className="flex mb-2 flex-col max-w-[526px] w-full mx-auto">
          <label
            htmlFor="dob-day"
            className="text-[#5F6368] text-[15px] font-normal self-start w-[90%] lg:w-full mx-auto"
          >
            Date of Birth *
          </label>
          <div className="flex justify-center items-center gap-2  w-[90%] lg:w-full mx-auto">
            <input
              type="number"
              required
              id="dob-day"
              ref={dayRef}
              onChange={handleDayInputChange}
              max="31"
              placeholder="DD"
              className="w-[32%] focus:border-[#0048ff] focus:ring-0 focus:outline-none placeholder-customGray lg:w-[170px] pl-2 h-[40px] rounded-[8px] border-[1px] border-[#DADCE0]"
            />
            <input
              type="number"
              id="dob-month"
              ref={monthRef}
              required
              onChange={handleMonthInputChange}
              placeholder="MM"
              className="w-[32%] focus:border-[#0048ff] focus:ring-0 focus:outline-none placeholder-customGray lg:w-[170px] pl-2 h-[40px] rounded-[8px] border-[1px] border-[#DADCE0]"
            />
            <input
              type="number"
              required
              id="dob-year"
              ref={yearRef}
              onChange={handleYearInputChange}
              placeholder="YYYY"
              className="w-[32%] focus:border-[#0048ff] focus:ring-0 focus:outline-none placeholder-customGray lg:w-[170px] pl-2 h-[40px] rounded-[8px] border-[1px] border-[#DADCE0]"
            />
          </div>
        </div>
        <div className="flex flex-col my-1 max-w-[526px] w-full mx-auto">
          <label
            htmlFor="postcode"
            className="text-[#5F6368] text-[15px] font-normal self-start w-[90%] lg:w-full mx-auto"
          >
            Postcode *
          </label>
          <div className="relative flex justify-start items-center lg:gap-4 md:gap-6 gap-12 w-[90%] lg:w-full mx-auto">
            <div className="flex flex-col w-full">
              <div className="flex lg:gap-10 gap-4">
                <input
                  type="text"
                  id="postcode"
                  required
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="SK17 9AE"
                  className="max-w-[404px] focus:border-[#0048ff] focus:ring-0 focus:outline-none placeholder-customGray w-[100%] md:w-[350px] lg:w-[380px] pl-2 h-[40px] rounded-[8px] border-[1px] border-[#DADCE0]"
                />
                <button
                  type="button"
                  onClick={handleSearchClick}
                  className="w-[30%] lg:w-[112px] h-[40px] rounded-[100px] text-white bg-[#1E1E1E]"
                >
                  search
                </button>
              </div>
              {isDropDownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute z-10 border border-gray-300 rounded-md bg-white w-full max-w-[404px] max-h-[170px] overflow-y-auto"
                >
                  {addresses.map((address, index) => (
                    <div
                      key={index}
                      onClick={() => handleAddressSelect(address)}
                      className="cursor-pointer p-2 hover:bg-gray-200"
                    >
                      {address.line1}, {address.line2}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {isPostcodeValid && (
          <div className="flex flex-col w-full justify-center items-center">
            <div className="w-[90%] lg:w-[526px] flex flex-col items-start">
              <label
                htmlFor="line1"
                className="text-[#5F6368] text-[15px] mb-1 font-normal"
              >
                Address Line 1
              </label>
              <input
                type="text"
                required
                id="line1"
                value={selectedAddress.line1}
                onChange={handleAddressChange}
                placeholder="48 Crowestones"
                className="w-full focus:border-[#0048ff] focus:ring-0 focus:outline-none placeholder-customGray pl-2 h-[40px] rounded-[8px] border-[1px] border-[#DADCE0]"
              />
            </div>
            <div className="w-[90%] lg:w-[526px] my-2 flex flex-col items-start">
              <input
                type="text"
                id="line2"
                value={selectedAddress.line2}
                onChange={handleAddressChange}
                placeholder="Buxton/Derbyshire"
                className="w-full pl-2 focus:border-[#0048ff] focus:ring-0 focus:outline-none h-[40px] placeholder-customGray rounded-[8px] border-[1px] border-[#DADCE0]"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="bg-[#1E1E1E] w-[90%] lg:w-[526px] h-[40px] py-15 pl-32 pr-24 mt-6 font-normal text-white rounded-[100px]"
        >
          place order
        </button>
      </form>
    </div>
  );
}
