import { useFormik } from "formik";
import React from "react";
import { Toaster } from "react-hot-toast";

import { resetPasswordValidations } from "../helper/validate";
import styles from "../styles/Username.module.css";

const Reset = () => {
  const formik = new useFormik({
    initialValues: {
      password: "Amin@123",
      confirm_pwd: "Admin@123",
    },
    validate: resetPasswordValidations,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass} style={{ width: "50%" }}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Reset</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter new Password.
            </span>
          </div>

          <form className="py-20" onSubmit={formik.handleSubmit}>
            <div className="textbox flex flex-col items-center">
              <input
                {...formik.getFieldProps("password")}
                className={styles.textbox}
                type="text"
                placeholder="New Password"
              />
              <input
                {...formik.getFieldProps("confirm_pwd")}
                className={styles.textbox}
                type="text"
                placeholder="Repeat Password"
              />
              <button type="submit" className={styles.btn}>
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reset;
