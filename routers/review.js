const express = require("express");
const { creactReview, getAllReview, deleteReview } = require("../controllor/review");
const { authMiddleware } = require("../middlewarer/authMiddlewarer");

const router = express.Router();

 router.post("/:tourId",authMiddleware,creactReview)
 router.get("/",getAllReview)
 router.post("/delete/:id",deleteReview)



module.exports = router;