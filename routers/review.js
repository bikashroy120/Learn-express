const express = require("express");
const { creactReview, getAllReview } = require("../controllor/review");
const { authMiddleware } = require("../middlewarer/authMiddlewarer");

const router = express.Router();

 router.post("/",authMiddleware,creactReview)
 router.get("/",getAllReview)



module.exports = router;