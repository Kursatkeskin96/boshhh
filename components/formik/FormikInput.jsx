"use client";
import { Field } from "formik";
import React from "react";

const formatDate = (value) => {
  value = value.replace(/\D/g, "");

  if (value.length >= 2) {
    value = value.slice(0, 2) + "/" + value.slice(2);
  }
  if (value.length >= 5) {
    value = value.slice(0, 5) + "/" + value.slice(5);
  }
  if (value.length > 10) {
    value = value.slice(0, 10);
  }
  return value;
};

const validateDate = (value) => {
  const datePattern = /^([0-2][0-9]|(3)[0-1])\/(0[1-9]|1[0-2])\/(\d{4})$/;

  if (!value.match(datePattern)) {
    return "Invalid date format. Use DD/MM/YYYY.";
  }

  const [day, month, year] = value.split("/").map(Number);

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return "Invalid date.";
  }

  const today = new Date();
  let age = today.getFullYear() - year;

  if (
    today.getMonth() + 1 < month ||
    (today.getMonth() + 1 === month && today.getDate() < day)
  ) {
    age--;
  }

  if (age < 18) {
    return "User must be at least 18 years old.";
  }

  return null;
};

const FormikInput = ({ name, label, required, type, onChange, ...props }) => {
  const handleChange = (e, form, field) => {
    if (!e || !e.target || typeof e.target.value === "undefined") {
      return;
    }

    let value = e.target.value;

    if (name === "dob") {
      value = formatDate(value);
      form.setFieldValue(name, value);
    } else {
      field.onChange(e);
    }

    if (name === "email" || (name === "telephoneNumber" && onChange)) {
      onChange(e.target.value);
    }
  };

  return (
    <Field name={name}>
      {({ field, form, meta }) => (
        <div
          className={`${
            name === "addressLine1" ||
            name === "addressLine2" ||
            name === "email"
              ? "w-full"
              : ""
          } flex relative w-1/2 flex-col pb-6`}
        >
          <input
            className={`${
              meta.error ? "border-red-500" : ""
            } border-[1px] h-12 rounded-md px-4 py-[6px]  placeholder:text-sm placeholder:text-gray-500`}
            type={type}
            {...field}
            {...props}
            id={name}
            value={field.value}
            onChange={(e) => handleChange(e, form, field)}
            autoComplete="off"
            placeholder={label}
          />

          <div>
            {meta.touched && meta.error && (
              <div className="text-red-500 text-xs">
                {meta.error || (name === "dob" && validateDate(field.value))}
              </div>
            )}
          </div>
        </div>
      )}
    </Field>
  );
};

export default FormikInput;
