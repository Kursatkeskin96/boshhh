import * as yup from "yup";
const validateDateAndAge = (value, context) => {
  // Regular expression to check the date format DD/MM/YYYY
  const datePattern = /^([0-2][0-9]|(3)[0-1])\/(0[1-9]|1[0-2])\/(\d{4})$/;

  // Check if the input matches the date pattern
  if (!value.match(datePattern)) {
    return context.createError({
      path: "dob",
      message: "Invalid date format. Use DD/MM/YYYY.",
    });
  }

  // Split the input into day, month, and year
  const [day, month, year] = value.split("/").map(Number);

  // Create a Date object
  const date = new Date(year, month - 1, day);

  // Check if the date is valid
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return context.createError({
      path: "dob",
      message: "Invalid date.",
    });
  }

  // Calculate the age
  const today = new Date();
  let age = today.getFullYear() - year;

  // Adjust age if the birthday hasn't occurred yet this year
  if (
    today.getMonth() + 1 < month ||
    (today.getMonth() + 1 === month && today.getDate() < day)
  ) {
    age--;
  }

  // Check if the user is at least 18 years old
  if (age < 18) {
    return context.createError({
      path: "dob",
      message: "User must be at least 18 years old.",
    });
  }

  // If all checks pass, return true
  return true;
};

const formValidationSchema = ({ email, phone }) =>
  yup.object({
    firstName: yup.string().required("Field is required"),
    lastName: yup.string().required("Field is required"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Field is required")
      .test("unique-email", "User already exists", function (value) {
        if (email === true) {
          return this.createError({
            path: "email",
            message: "User already exists with this email",
          });
        }
        return true;
      }),
    dob: yup
      .string()
      .required("Field is required")
      .test("valid-date-and-age", null, function (value) {
        return validateDateAndAge(value, this);
      }),
    telephoneNumber: yup
      .string()
      .required("Field is required")
      .matches(/^\d+$/, "Telephone number must be digits only")
      .test("exact-length", "Telephone number must be 11 digits", (value) => {
        return value && value.length === 11;
      })
      .test("unique-telephone", "Telephone number already exists", function () {
        if (phone === true) {
          return this.createError({
            path: "telephoneNumber",
            message: "Telephone number already exists",
          });
        }
        return true;
      }),
    addressLine1: yup.string().required("Field is required"),
    addressLine2: yup.string(),
    city: yup.string().required("Field is required"),
    postCode: yup
      .string()
      .required("Field is required")
      .matches(/^\d+$/, "Field must be digits only"),
  });

export default formValidationSchema;
