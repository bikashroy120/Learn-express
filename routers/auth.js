const express = require("express")
const { regester, login, sentOtp, varyfyOtp, changePassword, getallUser } = require("../controllor/auth")

const router = express.Router()


router.post("/",regester)
router.post("/login",login)
router.post("/send-otp",sentOtp)
router.post("/otp-verify",varyfyOtp)
router.post("/change-password",changePassword)
router.get("/",getallUser)


module.exports = router