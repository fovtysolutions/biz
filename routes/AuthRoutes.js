const express = require("express");
const router = express.Router();

const {
  withMobile,
  verifyOtp,
  withEmail,
  signUp,
  signIn,
} = require("../controller/Authcontroller");

router.post("/register/mobile", withMobile);
router.post("/register/verifilyotp", verifyOtp);
router.post("/register/emailverification", withEmail);
router.post("/register/signup", signUp);
router.post("/login", signIn);

module.exports = router;