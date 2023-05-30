import { Router } from "express";

const router = Router();

// GET Methods
router.route("/register").post((req, resp) => {
    return resp.status(200).json({
        success: true,
        message: "Registered successfully!",
    });
});

router.route("/registermail").post();
router.route("/authenticate").post();
router.route("/login").post();

// POST Methods
router.route("/user/:username").get();
router.route("/generateotp").get();
router.route("/verifyotp").get();
router.route("/createresetsession").get();

// PUT/PATCH Methods
router.route("/updateuser").put();
router.route("/resetpassword").put();

export default router;
