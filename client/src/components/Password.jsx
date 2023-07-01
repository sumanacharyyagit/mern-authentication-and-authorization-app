import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { Toaster, toast } from "react-hot-toast";
import avatar from "../assets/profile.png";

import styles from "../styles/Username.module.css";
import { passwordValidate } from "../helper/validate";
import useFetch from "../hooks/fetch.hook";
import { useAuthStore } from "../store/store";
import { verifyPassword } from "../helper/helper";

const Password = () => {
    const userName = useAuthStore((state) => state.auth.username);
    const [{ isLoading, apiData, serverError }] = useFetch(`/user/${userName}`);

    const formik = new useFormik({
        initialValues: {
            password: "Password@123",
        },
        validate: passwordValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async (values) => {
            let loginPromise = verifyPassword({
                username: userName,
                password: values.password,
            });
            toast.promise(loginPromise, {
                loading: "Checking...!",
                success: <b>Login Successfully...!</b>,
                error: <b>Password not matched!</b>,
            });
            loginPromise.then((resp) => {
                const { token } = resp.data;
                localStorage.setItem("token", token);
                navigate("/profile");
            });
        },
    });

    if (isLoading) {
        return <h1 className="text-2xl font-bold">Loading...!</h1>;
    }

    if (serverError) {
        return <h1 className="text-2xl text-red-500">{serverError.message}</h1>;
    }

    return (
        <div className="container mx-auto">
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <div className="flex justify-center items-center h-screen">
                <div className={styles.glass}>
                    <div className="title flex flex-col items-center">
                        <h4 className="text-5xl font-bold">
                            Hello{" "}
                            {apiData?.user?.firstNAme ||
                                apiData?.user?.username}
                        </h4>
                        <span className="py-4 text-xl w-2/3 text-center text-gray-500">
                            Lorem ipsum dolor sit amet.
                        </span>
                    </div>

                    <form className="py-1" onSubmit={formik.handleSubmit}>
                        <div className="profile flex justify-center py-4">
                            <img
                                src={apiData?.user?.profile || avatar}
                                className={styles.profile_img}
                                alt="avatar"
                            />
                        </div>
                        <div className="textbox flex flex-col items-center">
                            <input
                                {...formik.getFieldProps("password")}
                                className={styles.textbox}
                                type="password"
                                placeholder="Password"
                            />
                            <button type="submit" className={styles.btn}>
                                Signin
                            </button>
                        </div>
                        <div className="text-center py-4">
                            <span className="text-gray-500">
                                Forgot password{" "}
                                <Link className="text-red-500" to="/recovery">
                                    recover now!
                                </Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Password;
