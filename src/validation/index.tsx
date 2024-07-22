import * as yup from "yup";

export const RegisterSchema = yup
  .object({
    FirstName: yup
      .string()
      .required("firstname is required")
      .min(5, "firstname shouid be at least 5 characters"),
      LastName: yup
      .string()
      .required("lastname is required")
      .min(5, "lastname shouid be at least 5 characters"),
    mobile: yup
      .string()
      .required("mobile is required")
      .min(5, "mobile shouid be at least 5 characters"),
      CollegesName: yup
      .string()
      .required("CollegesName is required")
      .min(5, "CollegesName shouid be at least 5 characters"),
      UniversityName: yup
      .string()
      .required("universityname is required")
      .min(5, "universityname shouid be at least 5 characters"),
    email: yup
      .string()
      .required("email is required")
      .matches(/^[^@]+@[^@'.]+\.[^@'.]{2,}$/, "Not a valid email address"),
    password: yup
      .string()
      .required("password is required")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/,
        "Not a valid password address"
      ),
  })
  .required();
export const LoginSchema = yup
  .object({
    email: yup
      .string()
      .required("email is required")
      .matches(/^[^@]+@[^@'.]+\.[^@'.]{2,}$/, "Not a valid email address"),
    password: yup
      .string()
      .required("password is required")
      .min(3, "Username shouid be at least 6 characters"),
  })
  .required();
