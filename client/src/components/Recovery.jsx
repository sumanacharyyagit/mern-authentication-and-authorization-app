import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

import styles from "../styles/Username.module.css";
import { useAuthStore } from "../store/store";
import { generateOTP, verifyOTP } from "../helper/helper";
import { useNavigate } from "react-router-dom";
const Recovery = () => {
    const { username } = useAuthStore((state) => state.auth);
    const [OTP, setOTP] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        if (username) {
            (async () =>
                await generateOTP(username)
                    .then((OTP) => {
                        console.log(OTP, "OTP1");

                        if (OTP) {
                            return toast.success(
                                "OTP has been sent to your email successfully!"
                            );
                        }
                        return toast.error("Problem while generating the OTP!");
                    })
                    .catch((error) => {
                        console.log("Error: " + error);
                        return toast.error("Can't send the OTP to your email!");
                    }))();
        }
    }, [username]);

    async function onSubmitHandler(e) {
        e.preventDefault();
        try {
            const { status } = await verifyOTP(username, OTP);

            if (status === 201) {
                toast.success("Verified Successfully!");
                return navigate("/reset");
            }
        } catch (err) {
            return toast.error("Entered Wrong OTP!");
        }
    }

    function resendOTPHandler() {
        let sendPOromise = generateOTP(username);
        toast.promise(sendPOromise, {
            loading: "Sending...",
            success: <b>OTP has been sent to your email!</b>,
            error: <b>Could not send OTP!</b>,
        });
        sendPOromise.then((OTP) => {
            console.log(OTP, "OTP2");
        });
    }

    return (
        <div className="container mx-auto">
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <div className="flex justify-center items-center h-screen">
                <div className={styles.glass}>
                    <div className="title flex flex-col items-center">
                        <h4 className="text-5xl font-bold">Recovery</h4>
                        <span className="py-4 text-xl w-2/3 text-center text-gray-500">
                            Enter OTP to recover password.
                        </span>
                    </div>

                    <form className="py-20" onSubmit={onSubmitHandler}>
                        <div className="textbox flex flex-col items-center gap-6">
                            <div className="input text-center">
                                <span className="py-4 text-sm text-left text-gray-500">
                                    Enter 6 digit OTP sent to your email
                                    address.
                                </span>
                                <input
                                    className={styles.textbox}
                                    type="text"
                                    placeholder="OTP"
                                    onChange={(e) => setOTP(e.target.value)}
                                />
                            </div>
                            <button type="submit" className={styles.btn}>
                                Recover
                            </button>
                        </div>
                    </form>
                    <div className="text-center py-1">
                        <span className="text-gray-500">
                            {"Can't"} get OTP{" "}
                            <button
                                className="text-red-500"
                                onClick={resendOTPHandler}
                            >
                                resend!
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recovery;
