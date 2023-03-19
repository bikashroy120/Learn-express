const express = require("express")
const { regester, login, sentOtp, varyfyOtp } = require("../controllor/auth")

const router = express.Router()


router.post("/",regester)
router.post("/login",login)
router.post("/send-otp",sentOtp)
router.post("/otp-verify",varyfyOtp)


module.exports = router