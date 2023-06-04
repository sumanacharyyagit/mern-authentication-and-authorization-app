import UserModel from "../model/user.model.js";

// Middleware for Verify the User
export async function verifyUser(req, res, next) {
    try {
        const { username } = req.method === "GET" ? req.query : req.body;

        // Check the use existance
        let exist = await UserModel.findOne({ username });
        if (!exist) {
            return res.status(404).json({
                success: false,
                message: "Username not exist!",
            });
        }
        next();
    } catch (error) {
        console.log("Error: " + error);
        return res.status(400).json({
            success: false,
            message: "Authenticarion Error!",
        });
    }
}
