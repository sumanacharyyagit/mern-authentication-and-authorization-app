import { useFormik } from "formik";
import React, { useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

import { resetPasswordValidations } from "../helper/validate";
import styles from "../styles/Username.module.css";
import { resetPassword } from "../helper/helper";
import { useAuthStore } from "../store/store";
import { Navigate, useNavigate } from "react-router-dom";
import useFetch from "../hooks/fetch.hook";

const Reset = () => {
    const { username } = useAuthStore((state) => state.auth);
    const navigate = useNavigate();
    const [{ isLoading, apiData, status, serverError }] =
        useFetch("createresetsession");

    useEffect(() => {
        console.log(apiData);
    }, []);

    const formik = new useFormik({
        initialValues: {
            password: "Amin@123",
            confirm_pwd: "Admin@123",
        },
        validate: resetPasswordValidations,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async (values) => {
            let resetPromise = resetPassword({
                username,
                password: values.password,
            });

            toast.promise(resetPromise, {
                loading: "Updating...",
                success: <b>Reset Successfully...!</b>,
                error: <b>Could not Reset!</b>,
            });

            resetPromise.then(() => {
                navigate("/password");
            });
        },
    });

    if (isLoading) {
        return <h1 className="text-2xl font-bold">Loading...!</h1>;
    }

    if (serverError) {
        return <h1 className="text-2xl text-red-500">{serverError.message}</h1>;
    }

    if (status && status !== 201) {
        return <Navigate to={"/password"} replace:true />;
    }
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
