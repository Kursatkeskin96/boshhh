import { Field } from "formik";
import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const FormikSelect = ({
  name,
  label,
  onChange,
  required,
  options,
  ...props
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Field name={name}>
        {({ field, form, meta }) => {
          const selectedOption = options.find(
            (option) => option.value === field.value
          );
          return (
            <div className="flex flex-col space-y-2 mt-3">
              <label htmlFor={name} className="text-lg text-gray-500 uppercase">
                {label}
              </label>

              <div
                className="border rounded-md bg-white tracking-widest cursor-pointer uppercase text-gray-500 p-3"
                onClick={() => setOpen(!open)}
              >
                <div className="flex justify-between items-center">
                  <span>
                    {selectedOption ? selectedOption.label : "Select"}
                  </span>
                  {open ? (
                    <IoIosArrowUp className="text-gray-500" />
                  ) : (
                    <IoIosArrowDown className="text-gray-500" />
                  )}
                </div>
              </div>

              {open && (
                <div className="absolute z-10 w-full bg-white border rounded-md mt-1 shadow-lg">
                  {options.map((option, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 ${
                        field.value === option.value ? "bg-gray-200" : ""
                      }`}
                      onClick={() => {
                        form.setFieldValue(name, option.value);
                        setOpen(false);
                        if (onChange) {
                          onChange(option.value);
                        }
                      }}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 border-2 rounded-full flex items-center justify-center mr-3 ${
                            field.value === option.value
                              ? "bg-green-400 border-green-400"
                              : "border-gray-300"
                          }`}
                        >
                          {field.value === option.value && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-gray-500 uppercase">
                          {option.label}
                        </span>
                      </div>
                      <span className="text-gray-500">{option.price}</span>
                    </div>
                  ))}
                </div>
              )}

              {meta.touched && meta.error ? (
                <div style={{ color: "red" }}>{meta.error}</div>
              ) : null}
            </div>
          );
        }}
      </Field>
    </div>
  );
};

export default FormikSelect;
