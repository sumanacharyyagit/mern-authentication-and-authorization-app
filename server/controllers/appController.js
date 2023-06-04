import UserModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";

// {
// "username": "suman123",
// "password": "Suman@123",
// "email": "suman123@gmail.com",
// "firstname": "Suman",
// "lastname": "Acharyya",
// "mobile": "0987654321",
// "address": "NS Road, Kolkata - 700127",
// "profile": "",
// }
export async function register(req, res) {
    const { username, password, email, profile } = req.body;
    try {
        //Check for existing username
        const existUserNAme = new Promise((resolve, reject) => {
            UserModel.findOne({ username }).then((err, user) => {
                if (err) reject(new Error(err));
                if (user) reject({ message: "Please use unique userNAme!" });
                resolve();
            });
        });

        //Check for existing email address
        const existEmail = new Promise((resolve, reject) => {
            UserModel.findOne({ email }).then((userResult) => {
                if (userResult) reject("Please use unique email!");
                resolve();
            });
        });

        Promise.all([existUserNAme, existEmail])
            .then((resp) => {
                if (password) {
                    bcrypt
                        .hash(password, 10)
                        .then((hashPass) => {
                            const user = new UserModel({
                                username,
                                password: hashPass,
                                email,
                                profile: profile || "",
                            });

                            // return saved result as response
                            user.save()
                                .then((resData) => {
                                    resData.password = undefined;
                                    return res.status(201).json({
                                        success: true,
                                        message: resData,
                                    });
                                })
                                .catch((err) => {
                                    console.log("Error: " + err);
                                    return res
                                        .status(201)
                                        .json({ success: false, message: err });
                                });
                        })
                        .catch((err) => {
                            console.log(err);
                            return res.status(500).json({
                                success: false,
                                message: "Unable to hash password!",
                            });
                        });
                }
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Unable to create user!",
                    error: err,
                });
            });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Failed to Register!" });
    }
}

// {
// "username": "suman123",
// "password": "Suman@123",
// }
export async function login(req, res) {
    const { username, password } = req.body;
    try {
        UserModel.findOne({ username })
            .select("+password")
            .then((user) => {
                bcrypt
                    .compare(password, user.password)
                    .then((passResult) => {
                        if (!passResult) {
                            return res.status(400).json({
                                success: false,
                                message: "Password not exist!",
                            });
                        }

                        // Create JWT Token
                        const token = jwt.sign(
                            {
                                userId: user._id,
                                username: user.username,
                            },
                            process.env.JWT_SECRET_KEY,
                            {
                                expiresIn: "24h",
                            }
                        );
                        return res.status(200).json({
                            success: true,
                            message: "Loggedin successfully!",
                            username: user.username,
                            token,
                        });
                    })
                    .catch((err) => {
                        console.log("Error: ", err);
                        return res.status(400).json({
                            success: false,
                            message: "Password not matched!",
                        });
                    });
            })
            .catch((err) => {
                console.log("Error: ", err);
                return res.status(404).json({
                    success: false,
                    message: "Username not found!",
                });
            });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            success: false,
            message: error,
        });
    }
}

export async function getUser(req, res) {
    const { username } = req.params;
    try {
        if (!username)
            return res.status(400).json({
                success: false,
                message: "Invalid username!",
            });

        UserModel.findOne({ username })
            .select("+password") // Doing for testing purpose **
            .then((user) => {
                if (!user) {
                    return res.status(400).json({
                        success: false,
                        message: "Cannot find the user data!",
                    });
                }
                // **
                // const { password, ...rest } = user.toJSON();
                const { password, ...rest } = Object.assign({}, user.toJSON());
                return res.status(200).json({
                    success: true,
                    message: "Found the user data!",
                    // user,
                    user: rest,
                });
            })
            .catch((err) => {
                return res.status(400).json({
                    success: false,
                    message: err,
                });
            });
    } catch (error) {
        console.log("Error: ", error);
        return res
            .status(400)
            .json({ success: false, message: "Cannot find the user data!" });
    }
}

export async function updateUser(req, res) {
    try {
        // const id = req.query.id;
        const { userId: id } = req.user;
        if (id) {
            const body = req.body;
            // update the data
            UserModel.updateOne(
                { _id: id },
                { ...body }
                // { returnOriginal: false }
            )
                .then((result) => {
                    if (
                        !result.acknowledged ||
                        !result.modifiedCount ||
                        !result.matchedCount
                    )
                        throw err;
                    return res.status(201).json({
                        success: true,
                        message: "User updated successfully!",
                    });
                })
                .catch((err) => {
                    console.log("Error: ", err);
                    return res.status(201).json({
                        success: true,
                        message: "User information updation failed!",
                    });
                });
        } else {
            return res
                .status(401)
                .json({ success: true, message: "User mot found!" });
        }
    } catch (error) {
        console.log("Error: ", error);
        return res
            .status(401)
            .json({ success: false, message: "Failed to update!", error });
    }
}

export async function generateOTP(req, res) {
    try {
        req.app.locals.OTP = await otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });

        return res.status(201).json({
            success: true,
            message: "User reset password OTP Generated!",
            otp: req.app.locals.OTP,
        });
    } catch (error) {
        console.log("Error: ", error);
        return res
            .status(401)
            .json({ success: false, message: "OTP generation failed!" });
    }
}

export async function verifyOTP(req, res) {
    const { otp } = req.query;
    try {
        if (parseInt(req.app.locals.OTP) === parseInt(otp)) {
            // reset and start session for reset password
            req.app.locals.OTP = null;
            req.app.locals.resetSession = true;
            return res
                .status(201)
                .json({ success: true, message: "Verified Successsfully!" });
        }
        return res
            .status(400)
            .json({ success: false, message: "OTP verification failed!" });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(400).json({
            success: false,
            message: "Error while password reset session!",
        });
    }
}

export async function createResetSession(req, res) {
    try {
        if (req.app.locals.resetSession === true) {
            req.app.locals.resetSession = false;
            return res
                .status(201)
                .json({ success: true, message: "Access Granted" });
        }
        return res
            .status(440)
            .json({ success: true, message: "Session Expired!" });
    } catch (error) {
        console.log("Error: ", error);
        return res
            .status(400)
            .json({ success: true, message: "Access Denied!" });
    }
}

export async function resetPassword(req, res) {
    try {
        if (!req.app.locals.resetSession) {
            return res.status(440).json({
                success: false,
                message: "Session expired!",
            });
        }
        const { username, password } = req.body;
        try {
            UserModel.findOne({ username })
                .then((user) => {
                    bcrypt
                        .hash(password, 10)
                        .then((hashPass) => {
                            UserModel.updateOne(
                                { username: user.username },
                                { password: hashPass }
                            )
                                .then((data) => {
                                    if (!data) {
                                        throw Error(
                                            "Unable to hash the password!"
                                        );
                                    }
                                    req.app.locals.resetSession = false;

                                    return res.status(201).json({
                                        success: true,
                                        message:
                                            "Successfully reset the password!",
                                    });
                                })
                                .catch((err) => {
                                    console.log("Error: ", err);
                                    return res.status(500).json({
                                        success: false,
                                        message: "Unable to hash the password!",
                                        error: err,
                                    });
                                });
                        })
                        .catch(() => {
                            console.log("Error: ", error);
                            return res.status(500).json({
                                success: false,
                                message: "Error while hashing the password!",
                                error: err,
                            });
                        });
                })
                .catch((error) => {
                    console.log("Error: ", error);
                    return res.status(400).json({
                        success: false,
                        error,
                        message: "User not found!",
                    });
                });
        } catch (error) {
            console.log("Error: ", error);
            return res.status(500).json({
                success: false,
                error,
                message: "Error while password reset!",
            });
        }
    } catch (error) {
        console.log("Error: ", error);
        return res.status(401).json({
            success: false,
            message: "Error while Reset the password!",
            error,
        });
    }
}
