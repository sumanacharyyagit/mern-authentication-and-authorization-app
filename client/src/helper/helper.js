import axios from "axios";
import jwtDecode from "jwt-decode";
// Set BaseURL
// axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
const REACT_APP_BASEURL = "http://localhost:8080";
axios.defaults.baseURL = REACT_APP_BASEURL;

// Make API request
// To GET UserName from Token
export async function getUsername() {
    const token = localStorage.getItem("token");
    if (!token) return Promise.reject("Token not found!");
    // if (!token) return Promise.reject("Token not found!");
    let decodedToken = jwtDecode(token);
    return decodedToken;
}

// Authenticate Function
export async function authenticate(username) {
    try {
        return await axios.post("/api/v1/authenticate", {
            username,
        });
    } catch (error) {
        return { error: "Username doesn't exist!" };
    }
}

// Get User Details Function
export async function getUser({ username }) {
    try {
        const { data } = await axios.get(`/api/v1/user/${username}`);
        return data;
    } catch (error) {
        return { error: "password doesn't match!" };
    }
}

// Register User Function
export async function registerUser(credentials) {
    try {
        const {
            data: { message },
            status,
        } = await axios.post(`/api/v1/register`, credentials);

        let { email, username } = credentials;
        if (status === 201) {
            await axios.post(`/api/v1/registermail`, {
                username,
                userEmail: email,
                text: message,
            });
        }
        return Promise.resolve(message);
    } catch (error) {
        return Promise.reject({ error });
    }
}

// Login User Function
export async function verifyPassword({ username, password }) {
    try {
        if (username) {
            const { data } = await axios.post(`/api/v1/login`, {
                username,
                password,
            });
            return Promise.resolve({ data });
        }
    } catch (error) {
        return Promise.reject({ error: "Password doesn't match!" });
    }
}

// Update User profile Function
export async function updateUSer(response) {
    try {
        const token = await localStorage.getItem("token");

        const { data } = await axios.put(
            `/api/v1/updateuser`,
            {
                ...response,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return Promise.resolve(data);
    } catch (error) {
        return Promise.reject({ error: "Couldn't update the profile!" });
    }
}

// Generate OTP for User profile Function
export async function generateOTP(username) {
    try {
        const token = localStorage.getItem("token");

        const {
            data: { message, otp },
            status,
        } = await axios.get(
            `/api/v1/generateotp`,
            { params: { username } },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (status === 201) {
            const {
                data: { email },
            } = await getUser({ username });
            const text = `Your Password recovery code is ${otp}, verify to recover password!`;
            await axios.post("/api/v1/registermail", {
                username,
                userEmail: email,
                text,
                subject: "Password recovery OTP.",
            });
        }
        return Promise.resolve({ message, otp });
    } catch (error) {
        return Promise.reject({ error: "Couldn't generate OTP!" });
    }
}

// Verify OTP for User profile Function
export async function verifyOTP(username, otp) {
    try {
        const { data, status } = await axios.get(`/api/v1/verifyotp`, {
            params: { username, otp },
        });

        return { data, status };
    } catch (error) {
        return Promise.reject({ error: "Couldn't verify the OTP!" });
    }
}

// Reset Password Function
export async function resetPassword({ username, password }) {
    try {
        const { data, status } = await axios.put(`/api/v1/resetpassword`, {
            username,
            password,
        });

        return Promise.resolve({ data, status });
    } catch (error) {
        return Promise.reject({ error: "Couldn't reset the password!" });
    }
}
