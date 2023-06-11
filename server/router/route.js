import { Router } from "express";

import * as controller from "../controllers/appController.js";
// import * as middleware from "../middlewares/userMiddleware.js";
import { verifyUser } from "../middlewares/userMiddleware.js";
import Auth, { localVariables } from "../middlewares/auth.js";
import { registerMail } from "../controllers/mailer.js";

const router = Router();

// GET Methods
router.route("/register").post(controller.register);

router.route("/registermail").post(registerMail);
router.route("/authenticate").post(verifyUser, (req, res) => res.end());
router.route("/login").post(verifyUser, controller.login);

// POST Methods
router.route("/user/:username").get(controller.getUser);
router
    .route("/generateotp")
    .get(verifyUser, localVariables, controller.generateOTP);
router.route("/verifyotp").get(verifyUser, controller.verifyOTP);
router.route("/createresetsession").get(controller.createResetSession);

// PUT/PATCH Methods
router.route("/updateuser").put(Auth, controller.updateUser);
router.route("/resetpassword").put(verifyUser, controller.resetPassword);

export default router;
