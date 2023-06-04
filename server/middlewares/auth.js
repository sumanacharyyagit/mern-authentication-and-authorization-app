import jwt from "jsonwebtoken";

// Auth Middleware
export default async function Auth(req, res, next) {
    try {
        // Authorize header to validate request
        const token = req.headers["authorization"].split("Bearer ")[1];

        //retrieve user details fro logged in user
        const decodedToken = await jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        );

        req.user = decodedToken;
        next();
    } catch (error) {
        console.log("Error: " + error);
        return res.status(401).json({
            success: falsem,
            message: "Error while authentication",
            error: error,
        });
    }
}

export function localVariables(req, res, next) {
    req.app.locals = {
        OTP: null,
        resetSession: false,
    };
    next();
}
